#!/usr/bin/env python3
"""Build the proposed ULB registry for the fix pack from saved copies of the data.

  python3 build-registry.py <app repo> <output folder>

Anchor: the ULBs in the three MEPMA tables, keyed on MEPMA ulb_id. Every ULB name in every saved small
table, and in the CDMA door to door file for 12 August, is attached to an anchor by the first rule that
applies:
  1. the same name and district, ignoring case, spaces and punctuation;
  2. an approved decision in the app's crosswalk review (lib/crosswalk-seed.ts), except the overrides below;
  3. the same name as exactly one anchor statewide, unless the LGD district codes disagree;
  4. the same spelling as an approved decision filed under another district label, unless the LGD district codes disagree;
  5. CDMA names only: the row's LGD mandal code is one the anchor already carries, in the same LGD district;
  6. CDMA names only: the name contains one of the anchor's known spellings, or is contained in one, in the same district;
  7. CDMA names only: spelling similarity of 0.75 or more, at least 0.1 ahead of the next anchor in the same district.
Rules 4 to 7 are flagged for review. A CDMA ULB that attaches to no anchor gets its own row, keyed on its
CDMA ulb_code, and small table names spelled the same join it. Names still unattached are written to the
unresolved file. spellings_found counts the distinct ways the ULB name is written; spellings lists each
district and name pair as written. Nothing here is approved by anyone.
"""
import collections, csv, difflib, glob, json, os, re, sys

APP, OUT = (sys.argv[1], sys.argv[2]) if len(sys.argv) > 2 else ('.', '.')
MEPMA = ['sasa_mepma_households_promoted_for_home_composite_api', 'sasa_mepma_entrepreneurs_promoted_for_circular_economy_api',
         'sasa_households_promoted_for_terrace_gardening_kitchen_gardens_api']
CDMA = 'msw_door_to_door_collection_api'
# Decisions in the app review that this registry does not follow. None since 14 September 2026, when the app
# review itself rejected B.Kothakota as MADANAPALLE.
OVERRIDES = {}
t = lambda v: '' if v is None else str(v).strip()
bare = lambda v: t(v).strip('"').strip()
sig = lambda v: re.sub(r'[^a-z0-9]', '', t(v).lower())
load = lambda path: (lambda j: j.get('records') or (j.get('response') or {}).get('records') or [])(json.load(open(path)))
codes = lambda rows, field: {o[field] for o in rows if o[field] and o[field].upper() != 'NULL'}

anchors = {}
for key in MEPMA:
    for r in load(f'{APP}/data/current-snapshots/{key}.json'):
        anchors.setdefault(t(r['ulb_id']), {'id': t(r['ulb_id']), 'name': bare(r['ulb_name']), 'district': bare(r['district_name'])})
by_place, by_name = collections.defaultdict(list), collections.defaultdict(list)
for a in anchors.values():
    by_place[(sig(a['district']), sig(a['name']))].append(a['id'])
    by_name[sig(a['name'])].append(a['id'])

source = open(f'{APP}/lib/crosswalk-seed.ts').read()
seed = json.loads(source[source.index('= {') + 2: source.rindex('}') + 1])
approved = {k: d['ulbId'] for k, d in seed.items() if d['state'] == 'approved' and k not in OVERRIDES}
blocked = {k for k, d in seed.items() if d['state'] == 'rejected'} | set(OVERRIDES)
approved_by_name = collections.defaultdict(set)
for k, u in approved.items():
    approved_by_name[k.split('|', 1)[1]].add(u)

occurrences = []
def add(dataset, r, cdma=False):
    name = r.get('ulb_nm') or r.get('ulb_name')
    if not bare(name):
        return
    occurrences.append({'dataset': dataset, 'district': t(r.get('dstrt_nm') or r.get('district_name')), 'name': t(name),
                        'dist': t(r.get('lgd_dist_code') or r.get('lgd_district_code') or r.get('api_lgd_dist_code')),
                        'mandal': t(r.get('lgd_mandal_code') or r.get('api_lgd_mandal_code')), 'cdma': t(r.get('ulb_code')) if cdma else ''})
for folder in ('current-snapshots', 'full-snapshots'):
    for f in sorted(glob.glob(f'{APP}/data/{folder}/*.json')):
        for r in load(f):
            add(os.path.basename(f)[:-5], r)
reference_day = sorted(glob.glob(f'{APP}/data/large-snapshots/reference-day/{CDMA}/page-*.json'))
if not reference_day:
    sys.exit(f'Stopped: no CDMA reference day pages under {APP}/data/large-snapshots/reference-day/{CDMA}. '
             'This input is too large for the repository, so a fresh clone cannot rebuild the registry; without it every ULB would look absent from CDMA.')
for f in reference_day:
    for r in load(f):
        add(f'{CDMA} (12 August)', r, cdma=True)

items = collections.defaultdict(list)
for o in occurrences:
    items[(sig(o['district']), sig(o['name']))].append(o)
item_id = lambda key: f'{key[0]}|{key[1]}'
assign, how, review = {}, {}, set()

def known():
    dist, mandal = collections.defaultdict(set), collections.defaultdict(set)
    dsig = collections.defaultdict(set, {u: {sig(a['district'])} for u, a in anchors.items()})
    nsig = collections.defaultdict(set, {u: {sig(a['name'])} for u, a in anchors.items()})
    for key, u in assign.items():
        dist[u] |= codes(items[key], 'dist'); mandal[u] |= codes(items[key], 'mandal')
        dsig[u].add(key[0]); nsig[u].add(key[1])
    return dist, mandal, dsig, nsig

def attach(key, u, reason, flagged):
    assign[key], how[key] = u, reason
    if flagged:
        review.add(key)

for key in items:
    if len(by_place.get(key, [])) == 1:
        attach(key, by_place[key][0], 'same name and district', False)
    elif item_id(key) in approved:
        attach(key, approved[item_id(key)], 'approved in the app crosswalk review', False)

dist_of, _, _, _ = known()
for key in items:
    if key in assign or item_id(key) in blocked:
        continue
    d = codes(items[key], 'dist')
    consistent = lambda u: not d or not dist_of[u] or bool(d & dist_of[u])
    same = by_name.get(key[1], [])
    if len(same) == 1 and consistent(same[0]):
        attach(key, same[0], 'same name, district written differently', False)
        continue
    named = approved_by_name.get(key[1], set())
    if len(named) == 1 and consistent(next(iter(named))):
        attach(key, next(iter(named)), 'same spelling as an approved decision under another district label', True)

dist_of, mandal_of, dsig_of, nsig_of = known()
for key, rows in items.items():
    if key in assign or item_id(key) in blocked or not codes(rows, 'cdma'):
        continue
    d, m = codes(rows, 'dist'), codes(rows, 'mandal') | codes(rows, 'cdma')
    near = [u for u in anchors if dist_of[u] & d or key[0] in dsig_of[u]]
    hits = [u for u in anchors if dist_of[u] & d and mandal_of[u] & m]
    if len(hits) == 1:
        attach(key, hits[0], f'LGD mandal code {sorted(mandal_of[hits[0]] & m)[0]}', True)
        continue
    # A qualifier such as ATMAKUR(NANDYAL) or VISAKHAPATNAM(GVMC) names the district, so a spelling equal to the district is not evidence.
    contains = [u for u in near if any(len(n) >= 4 and n != key[0] and (n in key[1] or key[1] in n) for n in nsig_of[u])]
    if len(contains) == 1:
        attach(key, contains[0], f'its name contains "{anchors[contains[0]]["name"]}" or a known spelling of it', True)
        continue
    scored = sorted(((difflib.SequenceMatcher(None, key[1], sig(anchors[u]['name'])).ratio(), u) for u in near), reverse=True)
    if scored and scored[0][0] >= 0.75 and (len(scored) == 1 or scored[0][0] - scored[1][0] >= 0.1):
        attach(key, scored[0][1], f'spelling similarity {scored[0][0]:.2f}', True)

cdma_only = collections.defaultdict(set)
for key, rows in items.items():
    if key not in assign:
        for c in codes(rows, 'cdma'):
            cdma_only[c].add(key)
cdma_sig = {c: {k[1] for k in keys} for c, keys in cdma_only.items()}
for key, rows in items.items():
    if key in assign or codes(rows, 'cdma') or (item_id(key) in seed and item_id(key) not in blocked):
        continue
    hit = [c for c, names in cdma_sig.items() if key[1] in names]
    if len(hit) == 1:
        cdma_only[hit[0]].add(key)

def build(key_name, name, district, mepma, keys):
    rows = [o for k in keys for o in items[k]]
    names = sorted({o['name'] for o in rows})
    dist, mandal, cdma = sorted(codes(rows, 'dist')), sorted(codes(rows, 'mandal')), sorted(codes(rows, 'cdma'))
    flags = []
    if len(mandal) > 1: flags.append('several mandal codes (A3, C1)')
    if len(names) >= 4: flags.append(f'{len(names)} spellings (A1)')
    if len(dist) > 1: flags.append('district codes disagree (N4)')
    if not dist: flags.append('no LGD district code in any dataset')
    if mepma and not cdma: flags.append('not in the CDMA daily files')
    if not mepma: flags.append('not in the MEPMA tables')
    if len(cdma) > 1: flags.append('more than one CDMA ULB attached, review needed')
    for k in sorted(keys):
        first = items[k][0]
        if k in review:
            flags.append(f'"{bare(first["name"])}" ({bare(first["district"])}) attached by {how[k]}, review needed')
        if item_id(k) in OVERRIDES:
            flags.append(f'"{bare(first["name"])}" is not MADANAPALLE. {OVERRIDES[item_id(k)]}')
    return {'proposed_key': key_name, 'ulb_name': name, 'district': district, 'mepma_ulb_id': mepma, 'cdma_ulb_code': ';'.join(cdma),
            'lgd_district_codes': ';'.join(dist), 'lgd_mandal_codes': ';'.join(mandal), 'lgd_local_body_code': '',
            'spellings_found': len(names), 'spellings': ' | '.join(sorted({f'{o["district"]} / {o["name"]}' for o in rows})),
            'datasets': len({o['dataset'] for o in rows}), 'review_flags': '; '.join(flags)}

attached = collections.defaultdict(set)
for key, u in assign.items():
    attached[u].add(key)
registry = [build(f'MEPMA-{a["id"]}', a['name'], a['district'], a['id'], attached[a['id']]) for a in anchors.values()]
for c, keys in cdma_only.items():
    first = next(o for k in keys for o in items[k] if o['cdma'] == c)
    registry.append(build(f'CDMA-{c}', bare(first['name']), bare(first['district']), '', keys))
registry.sort(key=lambda r: (r['district'].upper(), r['ulb_name'].upper()))

placed = set(assign) | {k for keys in cdma_only.values() for k in keys}
unresolved = []
for key, rows in items.items():
    if key in placed:
        continue
    reason = 'rejected in the app crosswalk review' if item_id(key) in seed and seed[item_id(key)]['state'] == 'rejected' else 'no anchor or CDMA ULB with this name or code'
    unresolved.append({'district': rows[0]['district'], 'spelling': rows[0]['name'], 'datasets': len({o['dataset'] for o in rows}), 'rows': len(rows), 'reason': reason})
unresolved.sort(key=lambda r: (r['district'].upper(), r['spelling'].upper()))

os.makedirs(OUT, exist_ok=True)
for path, rows, fields in ((f'{OUT}/ulb-registry-proposed.csv', registry, None), (f'{OUT}/ulb-spellings-unresolved.csv', unresolved, ['district', 'spelling', 'datasets', 'rows', 'reason'])):
    with open(path, 'w', newline='') as handle:
        writer = csv.DictWriter(handle, fieldnames=fields or list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
print(json.dumps({'anchors': len(anchors), 'registryRows': len(registry), 'cdmaUlbs': len({o['cdma'] for o in occurrences if o['cdma']}),
                  'anchorsWithCdma': sum(1 for r in registry if r['mepma_ulb_id'] and r['cdma_ulb_code']),
                  'cdmaOnly': [r['ulb_name'] for r in registry if not r['mepma_ulb_id']],
                  'mepmaOnly': [r['ulb_name'] for r in registry if r['mepma_ulb_id'] and not r['cdma_ulb_code']],
                  'moreThanOneCdma': [r['ulb_name'] for r in registry if ';' in r['cdma_ulb_code']],
                  'flaggedForReview': sum(1 for r in registry if 'review needed' in r['review_flags']),
                  'unresolvedNames': len(unresolved)}, indent=1))
