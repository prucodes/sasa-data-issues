# Crosswalk evidence (C1, N4, A3, A2)

The code problems in `code-defects.csv` were all found by looking for contradictions *inside* the data: a label carrying two codes, a ULB carrying two mandal codes. That method can prove something is wrong but it cannot say which value is right, and it is blind to a value that is wrong consistently.

On 3 October 2026 the Data Lake catalogue grew from 42 datasets to 61, and the new `aware` collection includes `aware_district_geo_api`, a district reference table with LGD codes that comes from a different provider than SASA. That is the first outside authority any of this can be checked against. This note is what it settles.

Nothing here is approved. Two of the five findings close an existing item rather than adding one, and I have said so where that is the case.

## The outside authority, and how to reproduce it

`aware_district_geo_api` is a boundary vertex table, 145,571 rows, with six columns: `State`, `District`, `Dstcodeap`, `Dstcodeind`, `Longitude`, `Latitude`. `Dstcodeind` is the LGD district code. The attributes repeat on every vertex of a district, so one row per district is enough and the whole table never has to be pulled.

```
POST /api/v1/datasets/aware_district_geo_api/query
{"departmentId":"DEPT-AILABS","purpose":"BENEFIT_DISBURSEMENT","filters":{"district":"Kurnool"}}
```

Three traps, all of which cost me time:

1. **The filter is exact and case sensitive.** `"Kurnool"` returns 3,783 rows and `"kurnool"` returns zero. A value that matches nothing returns an empty result, not an error, so a misspelling looks like a missing district.
2. **Two districts only answer to AWARE's own spelling.** Code 743 is `Manyam`, not "Parvathipuram Manyam". Code 504 is `Y.S.R.Kadapa`, not "Kadapa", "YSR Kadapa" or "Y.S.R. Kadapa". I tried six spellings before finding each.
3. **A `pageToken` passed on the dataset page URL is ignored**, so every offset silently re-renders the first page. Filter by district name instead of paging.

The per-district row counts sum to 144,910 against a reported 145,571. The remaining 661 rows are `Yanam`, a Puducherry enclave carried under `State` "Andhra Pradesh" with `Dstcodeind` set to the literal string `NA`. Anyone building a district master list from this table gets a 29th district with no code unless they drop it.

## 1. The 28 LGD district codes in the SASA tables are correct

I checked every district code that appears in the retained SASA and SERP tables against `aware_district_geo_api`, one query per district. **All 28 agree.**

| Code | SASA `district_name` | AWARE `District` | Code | SASA `district_name` | AWARE `District` |
|---|---|---|---|---|---|
| 502 | ANANTHAPURAMU | Anantapuramu | 745 | ALLURI SITHARAMA RAJU | Alluri Sitharama Raju |
| 503 | CHITTOOR | Chittoor | 746 | KAKINADA | Kakinada |
| 504 | YSR KADAPA | Y.S.R.Kadapa | 747 | DR.B.R.AMBEDKAR KONASEEMA | Kona Seema |
| 505 | EAST GODAVARI | East Godavari | 748 | ELURU | Eluru |
| 506 | GUNTUR | Guntur | 749 | NTR | NTR |
| 510 | KRISHNA | Krishna | 750 | BAPATLA | Bapatla |
| 511 | KURNOOL | Kurnool | 751 | PALNADU | Palnadu |
| 515 | SRI POTTI SRIRAMULU NELLORE | S.P.S.Nellore | 752 | TIRUPATI | Tirupati |
| 517 | PRAKASAM | Prakasam | 753 | ANNAMAYYA | Annamayya |
| 519 | SRIKAKULAM | Srikakulam | 754 | SRI SATHYA SAI | Sri Satyasai |
| 520 | VISAKHAPATNAM | Visakhapatnam | 755 | NANDYAL | Nandyal |
| 521 | VIZIANAGARAM | Vizianagaram | 790 | MARKAPURAM | Markapuram |
| 523 | WEST GODAVARI | West Godavari | 791 | POLAVARAM | Polavaram |
| 743 | PARVATHIPURAM MANYAM | Manyam | 744 | ANAKAPALLI | Anakapalli |

Inside the retained copies, `lgd_dist_code` to `district_name` is already a strict function: across 2,212 district-coded rows in 17 tables, no code carries two names. So the district half of the crosswalk is sound in both directions, and the `lgd_district_code` row of `data-contract.md` is already satisfied by the data. **A2 and N4 are not district code problems.** They are label problems, which is finding 3.

## 2. C1 is resolved: `lgd_mandal_code` holds two different code systems, and here is which is which

C1 says a ULB carries two mandal codes "which looks like two coding schemes in one table". It is two coding schemes, and both can now be named.

Across the 1,792 mandal-coded rows in the retained tables, every value falls in one of two non-overlapping bands:

| Band | Rows | Share | What it is |
|---|---:|---:|---|
| 1000 to 1299 | 1,169 | 65.2% | The CDMA urban body code |
| 4800 to 5500 | 623 | 34.8% | The LGD mandal code |

Of the 91 ULBs that carry two values, **all 91 carry exactly one from each band and none carries two from the same band.** That is not a coding error inside one scheme, it is two schemes sharing a column.

The identification of each band rests on evidence outside the column:

- **The 1xxx band is the CDMA urban body code.** `ulb-registry-proposed.csv` was built independently and carries `cdma_ulb_code` per ULB. For every one of the 122 registry ULBs that has a 1xxx value in `lgd_mandal_codes`, that value is **identical** to its `cdma_ulb_code`. 122 of 122, zero exceptions. B Kothakota is 1189 in both, Bapatla 1019, Amalapuram 1059, Adoni 1015.
- **The 4800 to 5500 band is the LGD mandal code.** `aware_mandal_geo_api` returns `Mndcodeind` per mandal, and in every case checked it returns exactly the high value and never the low one: Gudur `05184`, Ramachandrapuram `04924`, Punganur `05415`, Rajampet `05246`.

**`lgd_local_body_code` is empty in all 126 registry rows**, so the platform has never supplied the column `data-contract.md` asks for. The two values it does supply are an urban body code and a mandal code, mixed.

Three consequences worth stating plainly:

1. **A join on `lgd_mandal_code` fails silently rather than matching wrongly.** The bands do not overlap, so a 1xxx row can never collide with a 4800+ row. The damage is lost matches, not wrong numbers. That is the better of the two failure modes and it means nothing already published from this column is wrong because of C1.
2. **This is why crosswalk reach is low.** Five tables use the 1xxx band only (`cd_waste_process_plants_revival_new1_api`, `fstps_stps_cotreatment_new1_api`, `ihhl_new_identification_new1_api`, `msw_cbg_units_new1_api`, `sewage_treated_qty_new1_api`). The green table served under three keys and `swacch_survekshan_info_new1_api` are mixed roughly half and half, and they hold all 311 of the C1 rows. No table uses the LGD band exclusively. So joining a 1xxx-only table to a mixed table succeeds on about half the rows by construction.
3. **It is therefore fixable, not an inherent limit.** Separating the bands is arithmetic on data already in hand, not a new data request.

## 3. What the 18 N4 rows actually are

Every N4 case is a place name that exists more than once. The nine label and code pairings cover eight places and divide into two kinds, and the division matters because only one kind can be settled from outside.

**Four pairings, three places: a wrong district join, provable because the same place name sits under two different district codes in our own copies. Here the departmental label is right and the code is wrong.**

| Place | Label says | Code says | How I know |
|---|---|---|---|
| Ramachandrapuram | Ambedkar Konaseema | 752 Tirupati | It appears under 747 with mandal 1065 and 4924, and under 752 with mandal 5398. AWARE holds exactly one Ramachandrapuram mandal, in Kona Seema, district 747, mandal `04924`. The Konaseema label is correct. Two pairings, because `swacch_survekshan_info_new1_api` spells the label `Dr. B.R. Ambedkar Konaseema` and the green table `Ambedkar Konaseema`. |
| GUDUR | SPSR Nellore | 511 Kurnool | It appears under 515 with mandal 5184 and under 511 with mandal 5257. AWARE places mandal `05184` in S.P.S.Nellore. |
| GUDURU | Kurnool | 510 Krishna | GUDURU appears only under 510 Krishna. Gudur and Guduru are different places one letter apart, and the join crossed them. |

**Five pairings, five places: the label and the code name a pre-2022 parent district and its post-2022 child, or two adjacent districts. These cannot be settled from outside, and the direction is not consistent.**

| Place | Label says | Code says | Which is the newer district |
|---|---|---|---|
| Rajampet | Annamayya | 504 YSR Kadapa | the label (Annamayya was carved from Kadapa) |
| Mandapeta | Ambedkar Konaseema | 505 East Godavari | the label (Konaseema was carved from East Godavari) |
| Punganur | Chittoor | 753 Annamayya | the code |
| Giddalur | Prakasam | 790 Markapuram | the code |
| Kandukur | SPS Nellore | 517 Prakasam | unclear, and I have not established it either way |

So it is not the case that either column is reliably the more current one. A rule that always preferred the code, or always the label, would be wrong in at least two of these five.

Four spelling families in the same tables are **legitimate respellings and must not be counted as defects**: `SPSR Nellore`, `SRI POTTI SRIRAMULU NELLORE` and `SPS Nellore` against `S.P.S.Nellore`, and `Baptla` against `Bapatla`. My first pass flagged 79 rows because it did not separate these from the real cases.

The real count is **19 rows across 9 pairings in 4 underlying tables**, 0.86% of the 2,212 district-coded rows. Counted as served it is 35 rows in 6 keys, because the green programme table is served under three keys and carries 8 of the 19.

Separately, the three `RAMACHANDRAPURAM` rows and the `GUDUR` row currently filed under N4 are reporting two *mandal* codes (1065 against 4924, 5184 against 5257). Under finding 2 the first of those pairs is a C1 case, not an N4 case.

## 4. A label that is wrong consistently is invisible to the current checks

In `sewage_treated_qty_new1_api`, `SPS Nellore` carries exactly one district code, 517 PRAKASAM, on both its rows, and the ULB on those rows is Kandukur. It is wrong, and because it is wrong only once it cannot be caught by a check that looks for a label carrying more than one code. `Chittoor` and `Prakasam` in the same table carry two codes each and are caught.

This is a limit of the method, not a bug in `validate.mjs`. Finding a consistently wrong label requires a list of which places belong to which district, and until 3 October there was no such list in the Data Lake. There is now, for the district level.

**Proposed check.** Given a district reference table, assert that every `lgd_dist_code` resolves to a district in it, and report any row where the departmental label is neither that district's name nor a known respelling of it. That catches all 9 pairings in finding 3, including the one the multiplicity test cannot see.

## 5. Do not take district codes from AWARE's mandal table

`aware_mandal_geo_api` carries `District`, `Dstcodeind` and a composite `Dmcodeind`, and its district codes contradict AWARE's own district table:

| Mandal | `District` | `Dstcodeind` | District table says |
|---|---|---:|---|
| Kavali | S.P.S.Nellore | 550 | S.P.S.Nellore is 515, and 550 is not a valid code |
| Punganur | Annamayya | 554 | Annamayya is 753, and 554 is not a valid code |
| Rajampet | Y.S.R.Kadapa | 753 | 753 is Annamayya; Y.S.R.Kadapa is 504 |
| Gudur | S.P.S.Nellore | 752 | 752 is Tirupati |
| Sullurpeta | Tirupati | 752 | correct |

`Dmcodeind` concatenates the wrong district code into a composite key, so Gudur reads `75205184`. Its `Mndcodeind` is reliable and was the basis of finding 2; its district columns are not. I tested whether the district code had been populated from the parliamentary constituency instead of the revenue district, which would have explained Gudur, and it does not hold for Kavali or Punganur, so the cause is unknown.

Two further defects in the same collection, for completeness: the columns named `Longitude` and `Latitude` hold projected coordinates in metres in the mandal table (Gudur reads 374887.85, 1557769.77) but true degrees in the district and village tables, under identical names; and `aware_village_geo_api` has `Village` and `Villcodeap` empty on every row of its first page.

## What I propose for `data-contract.md`

Three changes, for review and not applied:

1. Keep `lgd_district_code` as written. The data already meets it, and `aware_district_geo_api` is the reference table that makes it checkable. Name that table in the contract.
2. Replace the `lgd_local_body_code` row's note. The problem is not that the mandal code stands in for a local body code; it is that one column carries two code systems. The contract should ask for **`cdma_ulb_code`** for the 1000 to 1299 value and **`lgd_mandal_code`** for the 4800 to 5500 value, as separate columns, with neither accepting the other's range.
3. Add that `source_label` must never be used to infer a district when a code is present. Finding 3 shows the label is wrong on 19 rows where the code is right, and finding 4 shows one case where the opposite holds, so neither can be trusted alone. The code plus a reference table is checkable; the label is not.

## A test that would show it is fixed

1. Every `lgd_mandal_code` value in every table falls in one band, and no ULB in any table carries values from both. Today 91 ULBs do.
2. Every ULB that has a CDMA code carries it in its own column, and that column never holds a 4800 to 5500 value.
3. Every `lgd_dist_code` resolves against `aware_district_geo_api`, and every departmental label on those rows is that district's name or a declared respelling. Today 19 rows fail.
4. Joining `ihhl_new_identification_new1_api` to the green programme table on the urban body code matches every ULB present in both. Today it matches about half.

## What this does not decide

Which value is right in the five parent and child cases in finding 3. A stale label and a stale code look the same from outside, and knowing which district is newer does not settle where the row's measures belong: if Giddalur reported its sewage through Prakasam, the figure may be in Prakasam's total whatever the correct district is today. That is a question for the department, not something an outside reference table can answer.

The mandal and village levels also remain unverified. AWARE's mandal table cannot serve as the authority because of finding 5, and the ULB level has no reference table at all, which is why `ulb-registry-proposed.csv` is still a list of name matches for review.

## Evidence

Every figure above was computed from the retained copies in [`data/current-snapshots`](https://github.com/prucodes/sasa-intelligence-lab/tree/main/data/current-snapshots) and from `ulb-registry-proposed.csv` in this folder. The AWARE figures came from one query per district against the live platform on 3 October 2026, through the API playground, and each is reproducible with the single request shown at the top of this note.
