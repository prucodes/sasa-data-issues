#!/usr/bin/env node
/**
 * SASA data checks for Data Lake JSON responses.
 *
 *   node validate.mjs <response.json | folder> [more ...] [--md report.md] [--json report.json]
 *   node validate.mjs "Label=folder"      name a dataset in the report
 *
 * A folder holding page-*.json files is read as one dataset, so rows repeated across pages
 * show up. Every other .json file is read as one response.
 *
 * Each check points at an item on the data issues list. A finding means a row cannot be
 * accepted as it stands. It never decides which value is right; that stays with whoever
 * owns the data. No dependencies, Node 18 or later.
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

export const RULES = {
  'response.reconcile': { issue: 'N1', title: 'Pages return the reported total, but part of it repeats' },
  'row.exact-duplicate': { issue: 'N7', title: 'The same row appears more than once' },
  'row.conflicting-duplicate': { issue: 'A14', title: 'The same place and period with different numbers' },
  'month.carried-forward': { issue: 'N8', title: 'Almost every place repeats the previous month exactly' },
  'period.mismatch': { issue: 'A5', title: 'Month number and month name disagree' },
  'count.not-number': { issue: 'N6', title: 'Text in a column that otherwise holds numbers' },
  'number.stored-as-text': { issue: 'C3', title: 'Numbers stored as text, with quote marks or thousands separators' },
  'text.quote-marks': { issue: 'A1', title: 'Quote marks left inside a text value' },
  'code.missing': { issue: 'N5 C1', title: 'A code is blank or the text NULL where the rest of the file has one' },
  'code.label-to-many': { issue: 'N4', title: 'One district label carries more than one district code in the same file' },
  'code.ulb-is-mandal': { issue: 'A3', title: 'ulb_code holds the mandal code' },
};

const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
/** Housekeeping columns that change on reload and say nothing about the measure. A record ID names a row, not a place. */
const STAMPS = new Set(['i_ts', 'u_ts', 's_no', 'a_in', 'active_indicator', 'id', 'rec_id']);
const MONTH_NAME = ['mnth_nm', 'month_name'];
const MONTH_NUMBER = ['mnth_no', 'month_number', 'month_no', 'month_id', 'MONTH_ID', 'month'];
const PERIOD = new Set([...MONTH_NAME, ...MONTH_NUMBER, 'year', 'YEAR', 'fin_year', 'financial_year', 'date1', 'COLLECTION_DATE']);
/** A departmental label beside the code the source assigned it. One label should carry one code. */
const LABEL_CODE_PAIRS = [['dstrt_nm', 'lgd_dist_code'], ['dstrt_nm', 'lgd_district_code'], ['district_name', 'district_code'], ['district_name', 'api_lgd_dist_code']];
/** How close to every place a month has to repeat before it reads as carried forward, not unchanged. */
const CARRIED_FORWARD_SHARE = 0.95;
const EXAMPLES = 3;

const text = (value) => String(value ?? '').trim();
const missing = (value) => /^(|null|undefined|n\/?a|-)$/i.test(text(value));
const bare = (value) => text(value).replace(/^"|"$/g, '').replace(/,/g, '').replace(/%$/, '');
const numeric = (value) => /^-?\d+(\.\d+)?$/.test(bare(value));
/** Codes, IDs and serial numbers identify a place or a plant, so they are never read as measures. */
const isCode = (column) => /(^|_)(code|id|s_no|sno)$/i.test(column);
const canonical = (row, columns) => JSON.stringify(columns.map((column) => [column, text(row[column])]));

function responseOf(json) {
  if (Array.isArray(json)) return { records: json, meta: {} };
  const records = json.records ?? json.response?.records ?? json.data?.records ?? [];
  return { records, meta: json.responseMetadata ?? json.response?.responseMetadata ?? {}, key: json.requestEcho?.tableKey ?? json.responseMetadata?.tableKey };
}

/**
 * Calendar month of a row as YYYY-MM, or null for daily or undated rows. When the month number and
 * the month name disagree (A5), the number is used, so a month copied with its old name still counts
 * as its own month.
 */
function monthOf(row) {
  const name = MONTH_NAME.map((c) => text(row[c]).toUpperCase()).find(Boolean);
  const raw = MONTH_NUMBER.map((c) => text(row[c])).find(Boolean);
  if (/^\d{6}$/.test(raw ?? '')) return `${raw.slice(0, 4)}-${raw.slice(4)}`;
  const year = text(row.year ?? row.YEAR);
  let month = raw && Number(raw) >= 1 && Number(raw) <= 12 ? Number(raw) : 0;
  if (!month && name) month = MONTHS.indexOf(name) + 1;
  if (!month || !/^\d{4}$/.test(year)) return null;
  return `${year}-${String(month).padStart(2, '0')}`;
}
const previousMonth = (ym) => { const [y, m] = ym.split('-').map(Number); return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`; };

export function checkDataset(name, records, meta = {}, pages = 1) {
  const findings = Object.fromEntries(Object.keys(RULES).map((id) => [id, { count: 0, examples: [] }]));
  const note = (id, example, count = 1) => { findings[id].count += count; if (findings[id].examples.length < EXAMPLES) findings[id].examples.push(example); };
  const columns = [...new Set(records.flatMap((row) => Object.keys(row)))];

  // N1 and N7: repeats. Across pages they are a serving fault; inside one response, a data one.
  const seen = new Map(), rows = [];
  records.forEach((row, index) => {
    const whole = canonical(row, columns);
    if (seen.has(whole)) { if (pages === 1) note('row.exact-duplicate', { row: index, sameAs: seen.get(whole) }); }
    else { seen.set(whole, index); rows.push(row); }
  });
  const info = { rows: records.length, distinctRows: rows.length, pages };
  if (Number.isInteger(meta.totalRecordCount) && meta.totalRecordCount !== records.length) note('response.reconcile', { reported: meta.totalRecordCount, returned: records.length });
  if (meta.hasNextPage === true) note('response.reconcile', { hasNextPage: true, returned: records.length });
  if (pages > 1 && rows.length < records.length) note('response.reconcile', { returned: records.length, distinct: rows.length, repeatedShare: Number(((records.length - rows.length) / records.length).toFixed(4)) }, records.length - rows.length);

  // Everything below reads each distinct row once, so a repeat is never counted twice.
  const numericShare = Object.fromEntries(columns.map((column) => {
    const values = rows.map((row) => row[column]).filter((value) => !missing(value));
    return [column, values.length ? values.filter(numeric).length / values.length : 0];
  }));
  // A column that is mostly numbers is a measure, even when some values are text; those are N6.
  const measures = columns.filter((c) => !STAMPS.has(c) && !PERIOD.has(c) && !isCode(c) && numericShare[c] >= 0.5);
  const identity = columns.filter((c) => !STAMPS.has(c) && !PERIOD.has(c) && !measures.includes(c));
  const periodColumns = columns.filter((c) => PERIOD.has(c));
  const filled = Object.fromEntries(columns.map((c) => [c, rows.filter((row) => !missing(row[c]) && text(row[c]).toUpperCase() !== 'NULL').length / (rows.length || 1)]));

  // A14: one place and period carrying different numbers.
  const byKey = new Map();
  rows.forEach((row, index) => {
    const key = canonical(row, [...identity, ...periodColumns]);
    if (!byKey.has(key)) byKey.set(key, new Map());
    byKey.get(key).set(canonical(row, measures), index);
  });
  for (const [key, variants] of byKey) if (variants.size > 1) note('row.conflicting-duplicate', { key: JSON.parse(key).filter(([, v]) => v).slice(0, 6), variants: variants.size });

  // N8: a month is carried forward when nearly every place repeats the month before it.
  // Months nobody has reported yet are skipped: a plan that repeats its target into future
  // months is a plan, not a copy.
  const byPlace = new Map(), monthRows = new Map();
  for (const row of rows) {
    const month = monthOf(row);
    if (!month) continue;
    const tally = monthRows.get(month) ?? { rows: 0, complete: 0 };
    tally.rows += 1;
    if (measures.every((column) => !missing(row[column]))) tally.complete += 1;
    monthRows.set(month, tally);
    const place = canonical(row, identity);
    if (!byPlace.has(place)) byPlace.set(place, new Map());
    const months = byPlace.get(place);
    if (!months.has(month)) months.set(month, []);
    months.get(month).push(canonical(row, measures));
  }
  const reported = (month) => { const tally = monthRows.get(month); return Boolean(tally) && tally.complete / tally.rows >= 0.5; };
  const pairs = {};
  for (const months of byPlace.values()) for (const [month, list] of months) {
    const before = months.get(previousMonth(month));
    if (!before || !reported(month)) continue;
    const label = `${previousMonth(month)} to ${month}`;
    pairs[label] ??= { places: 0, identical: 0 };
    pairs[label].places += 1;
    if (JSON.stringify([...list].sort()) === JSON.stringify([...before].sort())) pairs[label].identical += 1;
  }
  for (const [label, pair] of Object.entries(pairs)) {
    if (pair.places >= 3 && pair.identical / pair.places >= CARRIED_FORWARD_SHARE) note('month.carried-forward', { months: label, identical: pair.identical, places: pair.places }, pair.identical);
  }
  if (Object.keys(pairs).length) info.monthPairs = pairs;

  // A5, N6, C3, A1 and N5.
  const quoted = new Set(), stored = new Map();
  rows.forEach((row, index) => {
    const monthName = MONTH_NAME.map((c) => text(row[c]).toUpperCase()).find(Boolean);
    const number = MONTH_NUMBER.map((c) => text(row[c])).find((v) => /^\d{1,2}$/.test(v));
    if (monthName && number && MONTHS.indexOf(monthName) + 1 !== Number(number)) note('period.mismatch', { row: index, name: monthName, number });
    for (const column of measures) {
      const value = row[column];
      if (missing(value)) continue;
      if (!numeric(value)) note('count.not-number', { row: index, column, value });
      else if (/^".*"$|,/.test(text(value))) { stored.set(column, (stored.get(column) ?? 0) + 1); }
    }
    for (const column of identity) {
      const value = text(row[column]);
      if (value.includes('"') && !quoted.has(`${column}|${value}`)) { quoted.add(`${column}|${value}`); note('text.quote-marks', { column, value }); }
    }
    const gaps = identity.filter((c) => isCode(c) && filled[c] >= 0.5 && (missing(row[c]) || text(row[c]).toUpperCase() === 'NULL'));
    if (gaps.length) note('code.missing', { row: index, columns: gaps, label: ['district_name', 'dstrt_nm', 'ulb_name', 'ulb_nm'].map((c) => text(row[c])).find(Boolean) ?? null });
  });
  for (const [column, count] of stored) note('number.stored-as-text', { column, example: rows.find((row) => /^".*"$|,/.test(text(row[column])))?.[column] }, count);

  // N4: a departmental label that maps to two codes inside one file.
  for (const [labelColumn, codeColumn] of LABEL_CODE_PAIRS) {
    if (!columns.includes(labelColumn) || !columns.includes(codeColumn)) continue;
    const codes = new Map();
    for (const row of rows) {
      const label = text(row[labelColumn]), code = text(row[codeColumn]);
      if (!label || missing(code) || code.toUpperCase() === 'NULL') continue;
      if (!codes.has(label)) codes.set(label, new Set());
      codes.get(label).add(code);
    }
    for (const [label, set] of codes) if (set.size > 1) note('code.label-to-many', { labelColumn, label, codeColumn, codes: [...set] });
  }

  // A3: how often ulb_code is simply the mandal code.
  if (columns.includes('ulb_code') && columns.includes('api_lgd_mandal_code')) {
    const paired = rows.filter((row) => !missing(row.ulb_code) && !missing(row.api_lgd_mandal_code));
    const same = paired.filter((row) => text(row.ulb_code) === text(row.api_lgd_mandal_code)).length;
    info.ulbCodeIsMandal = { same, of: paired.length };
    if (same) note('code.ulb-is-mandal', { same, of: paired.length }, same);
  }

  return { dataset: name, ...info, findings };
}

function load(argument) {
  const split = argument.indexOf('=');
  const [label, path] = split > 0 && existsSync(argument.slice(split + 1)) ? [argument.slice(0, split), argument.slice(split + 1)] : [null, argument];
  if (statSync(path).isDirectory()) {
    const files = readdirSync(path).sort();
    const pages = files.filter((f) => /^page-.*\.json$/.test(f));
    if (pages.length) {
      const parsed = pages.map((f) => responseOf(JSON.parse(readFileSync(join(path, f), 'utf8'))));
      const meta = parsed.find((p) => Number.isInteger(p.meta.totalRecordCount))?.meta ?? {};
      return [{ name: label ?? parsed.find((p) => p.key)?.key ?? basename(path), source: path, records: parsed.flatMap((p) => p.records), meta: { totalRecordCount: meta.totalRecordCount }, pages: pages.length }];
    }
    return files.filter((f) => f.endsWith('.json') && !/^(manifest|complete)\.json$/.test(f)).flatMap((f) => load(join(path, f)));
  }
  const { records, meta, key } = responseOf(JSON.parse(readFileSync(path, 'utf8')));
  return records.length ? [{ name: label ?? key ?? basename(path, '.json'), source: path, records, meta, pages: 1 }] : [];
}

function markdown(report) {
  const ids = Object.keys(RULES);
  const lines = [
    '# SASA data checks', '',
    `Checked ${report.datasets.length} datasets on ${report.checkedAt.slice(0, 10)} with \`validate.mjs\`. Each number counts rows, values or groups that could not be accepted as they stand. Repeated rows are counted once, except under N1 and N7.`, '',
    `| Dataset | Rows | ${ids.map((id) => RULES[id].issue).join(' | ')} |`, `|---|---:|${ids.map(() => '---:').join('|')}|`,
  ];
  for (const d of report.datasets) lines.push(`| ${d.dataset} | ${d.rows.toLocaleString('en-IN')} | ${ids.map((id) => d.findings[id].count ? d.findings[id].count.toLocaleString('en-IN') : '').join(' | ')} |`);
  lines.push('', '## What each column checks', '');
  for (const id of ids) lines.push(`* **${RULES[id].issue}**, \`${id}\`: ${RULES[id].title}.`);
  lines.push('', '## Examples', '');
  for (const d of report.datasets) {
    const hits = ids.filter((id) => d.findings[id].count);
    const repeats = Object.entries(d.monthPairs ?? {}).filter(([, v]) => v.identical);
    if (!hits.length && !repeats.length) continue;
    lines.push(`### ${d.dataset}`, '');
    for (const [pair, v] of repeats) lines.push(`* ${pair}: identical for ${v.identical} of ${v.places} place identities (each name and code combination counts once).`);
    for (const id of hits) lines.push(`* ${RULES[id].issue}, ${RULES[id].title}: ${d.findings[id].count.toLocaleString('en-IN')}. Example: \`${JSON.stringify(d.findings[id].examples[0])}\``);
    lines.push('');
  }
  return lines.join('\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const flag = (name) => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1] : null; };
  const mdPath = flag('--md'), jsonPath = flag('--json');
  if (!args.length) { console.error('Usage: node validate.mjs <response.json | folder | Label=folder> [more ...] [--md report.md] [--json report.json]'); process.exit(2); }
  const datasets = args.flatMap(load).map((d) => ({ source: d.source, ...checkDataset(d.name, d.records, d.meta, d.pages) }));
  const report = { checkedAt: new Date().toISOString(), rules: RULES, datasets };
  if (jsonPath) writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  if (mdPath) writeFileSync(mdPath, `${markdown(report)}\n`);
  for (const d of datasets) {
    const hits = Object.entries(d.findings).filter(([, f]) => f.count).map(([id, f]) => `${RULES[id].issue} ${f.count}`);
    console.log(`${d.dataset}: ${d.rows} rows${hits.length ? `, ${hits.join(', ')}` : ', no findings'}`);
  }
}
