# Where each figure on the data issues page comes from

I checked every figure on the [data issues page](https://prucodes.github.io/sasa-data-issues/) again on 14 September 2026. This file says what each one was checked against, so anyone can check it the same way.

Sources, as named below:

- **Live**: a call to the Data Lake API on 14 September, recorded in [`n1-2026-09-14/live-checks.json`](n1-2026-09-14/live-checks.json) or [`n1-2026-09-14/summary.json`](n1-2026-09-14/summary.json).
- **Saved copies**: my copies in the [app repository](https://github.com/prucodes/sasa-intelligence-lab). `data/current-snapshots` holds the 36 small tables from 9 and 10 September, repaired as described in `DATA_PROVENANCE.md`. `data/full-snapshots` holds the 28 August and 8 September copies.
- **8 September pull**: my paging pull of the CDMA daily files and PR door to door, kept on my machine because it is too large for a repository.
- **Validator**: [`validation-report.json`](../validation-report.json), from `validate.mjs` run on the saved copies.

Figures the page quotes from the 2 September list are what that list said, and were not checked again.

Statewide figures from the 8 September pull and the full 14 September exports can be checked here only against `summary.json`; the raw rows are kept on my machine and are available on request. The two district captures in `n1-2026-09-14` can be recounted in full. Whether Sundays and second Saturdays are scheduled days off is not in the data; the rates by day are.

## Top of the page

| Figure | Checked against | Result |
|---|---|---|
| 2 fixed, 1 mostly fixed, 4 partly fixed, 17 not fixed, 1 cannot test, 8 new | The status on each item | Matches |
| 42 datasets in the catalogue | Live catalogue | 42 |
| CDMA daily files cover 12 to 27 August | Live first page; every route in summary.json | 16 days, 12 to 27 August |
| PR door to door stops at 7 August | Live totals by month | August 280,371, which is 7 days; a September filter returns 502 |
| Small tables unchanged since 10 September | My live check on 11 September, row for row (those responses were not kept); totals again on 14 September | Unchanged |

## New items

| Item | Figure | Checked against | Result |
|---|---|---|---|
| N1 | 4,023 × 16 = 64,368, the reported total | Live total; saved 12 August reference day | 4,023 secretariats, 64,368 |
| N1 | Export of 26 codes: 64,368 rows, 32,206 different, up to 8 repeats | summary.json | Confirmed |
| N1 | Paging on 8 September: 40,636 different | 8 September pull | Confirmed |
| N1 | Visakhapatnam: 4,614 export, 5,067 paging, 2,741 in both | summary.json, district 520 | Confirmed |
| N1 | 1,766 of 3,915 paged rows not in the export | summary.json | Confirmed |
| N1 | Anantapuram, Chittoor and Markapuram exported twice, same rows | district_code-502 and 503; live-checks.json | Identical both times |
| N1 | Paging Anantapuram and Chittoor returns the same rows as export | district_code-502 and 503 summary.json | 0 rows differ either way |
| N1 | 1,439 of 2,880 and 4,614 of 9,216 | summary.json, districts 502 and 520 | Confirmed |
| N1 | 32,206 of 64,368, 32,286 of 64,528 twice | summary.json | 50.03% each |
| N1 | Every route: 50,477 of 64,368 and 50,571 of 64,528 | summary.json | 78.4% each |
| N1 | 12 August complete, 1 missing on 13 August, 2,860 on 27 August | summary.json | Confirmed |
| N1 | The small table rows that were missing, by place and month | Saved copies before and after the 14 September repair, and `data/retention-repairs/2026-09-14` | Nellore April, June, July; Guntur October, December; Tirupati, Venkatagiri, Sullurpet July; Kanigiri, Giddalur July; 6 sewage; 5 green |
| N1 | The same repeats in the earlier copies | Saved copies before the repair | Same positions and rows, 28 August for legacy waste, 8 September for the rest |
| N2 | ODF Plus and plastic units 84 rows to 28; e-autos 166 to 84 | Saved 28 August and 10 September copies | Confirmed |
| N2 | Old FSTP key: 70 ULB rows, now 28 district rows | Saved 28 August copy; live | Confirmed |
| N3 | Four vehicle keys, one 84 row table | Saved copies: content and table name | Identical, `d2d_collection_vehicles_api` |
| N3 | Three green keys, one 400 row table | Saved copies: content and table name | Identical, `apgbc_info_new1_api` |
| N3 | Soak pits returns the 336 compost pits rows | Live export of both | Identical row for row, work_name Compost Pits |
| N3 | All 64,368 segregation rows match a collection row | summary.json | 64,368 of 64,368 |
| N4 | Guduru under Kurnool coded in Krishna; Gudur under SPSR Nellore coded in Kurnool | Saved Swachh Survekshan table; code-defects.csv | 510 KRISHNA mandal 5031; 5257 in 511 KURNOOL |
| N4 | Ramachandrapuram coded in Tirupati; Rajampet 1120 and 5246 | Saved Swachh Survekshan and green tables | Confirmed |
| N5 | NULL district code, 816 rows, four towns, all four daily files | summary.json | Giddalur, Kanigiri, Markapur, Podili |
| N6 | The two Vijayawada examples; 27 text counts and 31 missing in 50,571 rows | 8 September pull; summary.json | Confirmed |
| N7 | 13,351 panchayats; July 1,241,643, August 280,371 | 8 September pull, distinct GRAM_PANCHAYAT_ID; live totals | Confirmed; June 1,201,590 and May 1,241,643 fit too |
| N7 | 42,889 July panchayat days once, some up to 46; 1,285,814 of 1,321,749 | 8 September pull; app PR aggregate; 13,351 × 99 days | Confirmed |
| N8 | Vehicles 28 of 28 twice; IHHL 123; ISWM 108; sweeping 13; compactors 12; CBG 6; C&D 3; sewage 121 plants; FSTP 35 plants; magic drains 28 twice; compost and soak 27 of 28 | Validator month pairs, and a separate recount | Both agree |
| N8 | Legacy waste 95 of 123 repeat | Validator month pairs | 95 of 123 |
| N8 | CSC 25, housing IHHL 27 and SBM IHHL 17 of 28 districts changed from June to July; MEPMA 58 to 87 of 123 changed | Validator month pairs | Confirmed |
| N8 | Green programme table: 24 of the 121 ULBs reported in both months changed | Recounted by district and ULB name. The validator counts each name and code combination, 37 of 198, which is not a count of ULBs | 123 ULBs, 121 in both months, 97 unchanged, 24 changed; Bhimavaram and Tiruvuru July only |

## Section A

| Item | Figure | Checked against | Result |
|---|---|---|---|
| A1 | Atmakur 14 and Gudur 13 spellings | Saved 10 September small tables and the 12 August CDMA file, every distinct written form | 14 and 13 |
| A1 | 17 names with quote marks across 10 datasets, with the two examples | Saved copies | Confirmed |
| A2 | id 17 and id 20 | Saved copies | As stated |
| A3 | 49,221 of 50,477; GVMC 1086 with four mandal codes | summary.json; 8 September pull | 97.5%; 1086, 1087, 1089, 4865 |
| A4 | IS_COLLECTED Yes or No; no blank collection values | 8 September pull; summary.json | Confirmed |
| A5 | 35 July FSTP rows say JUNE; 3 SERP rows each with "July "; case variants | Live; saved copies | Confirmed |
| A6 | 11,084 against 5,000; one SERP description says cumulative | Saved SERP table, sum of 28 rows; saved catalogue | Confirmed, Swachhata awareness |
| A7 | Two daily files use sachivalayam_code, two use secretariat_code | 8 September pulls | Confirmed |
| A8 | Insert and update times in four datasets, rec_id in sewage; the two timestamp formats | Saved copies | Confirmed |
| A9 | Periods 202604 to 202703, achievement to 202608, achivement; garbage_segregation values | Saved copies | Confirmed |
| A10 | active_indicator 1 on every row; a_in and u_ts in four datasets, s_no in three | CDMA pulls; saved copies | Confirmed |
| A12 | waste_segregation_api returns 404 | Live | 404 dataset_not_found |
| A13 | 12 August 42.3% zero; 13 to 27 August 99.5% to 99.9%; 95.1% overall; no blanks | summary.json | 42.31%; 99.48% to 99.86%; 95.14%; 0 blanks |
| A14 | ODF Plus May twice, 10 disagree, Alluri 1,296 or 389 against 1,323; now 2,115 | Saved 28 August and 10 September copies | Confirmed |
| A14 | Nellore 19 and 4 in June and July; PR SWPC 28 districts twice | Live; validator | Confirmed; the only exact copies left |

## Sections B and C

| Item | Figure | Checked against | Result |
|---|---|---|---|
| B2 | 400 naming the allowed filters; 502 for a value that matches nothing | Live | Messages as quoted |
| B3 | 28 rows, 4 districts with achievement, table name gobardhanunits_api | Live; saved copy | Confirmed |
| B4 | pageSize 2 and 1,000 return 100; access token 300 seconds | Live; the token response | Confirmed; refresh token 1,800 seconds |
| B5 | The AUDIT purpose message | Live | As quoted |
| B6 | ETag changes on identical calls; six datasets name what they replace | Live; saved catalogue | Confirmed |
| B7 | District filter on 32 of 42 under six names; month under four names; year on 10 | Saved catalogue | As stated |
| C1 | Three district code column names; two district name columns in a row, never three | Saved copies | Confirmed |

## How I built SASA Intelligence Lab

| Figure | Checked against | Result |
|---|---|---|
| All 42 held by 10 September; 27 of the 36 small tables unchanged, 9 revised | Saved catalogue; app revision inventory | Confirmed |
| PR door to door 3,965,247 rows to 1,285,814 panchayat days | App PR aggregate | Confirmed |
| 85,769 panchayat days; 74.71% to 73.42%; 86.82% to 85.24% on working days | App month series aggregate | Confirmed |
| 14 Sundays 1.8% to 3.0%; second Saturdays 10.9% to 12.7%; 75 of 82 working days 82% to 94%; 28 May 13%, 26 June 9% | App infrastructure series, daily rate | 1.83% to 3.01%; 10.92%, 11.05%, 12.67%; 82.6% to 94.2%; 13.22%, 9.31% |
| 84 district months, none agreeing on the target | App reconciliation | Confirmed |
| 3,024 of 4,023 secretariats on 12 August in the 8 September pull | 8 September pull | Confirmed |
| Gap Radar places 112 of 123 and ranks 116 on collection reach; 56.9% to 56.1%; 5 more placed and 2 changed category; Markapuram's 4 placed, no other ULB moved | `data/aggregates/ulb-service-snapshot.json` at commits f9052e6, cdd658b and 6172122; the app's ranking tests | 103, 108, 112 placed; 116 ranked on reach, because 4 ULBs report zero collection |

## Check it yourself, fix pack and corrections

| Figure | Checked against | Result |
|---|---|---|
| All six reproducible checks | Live on 14 September | Same results as quoted |
| Eleven checks in the validation script | validate.mjs | 11 |
| 12 labels, 18 rows; 80 and 77 ULBs with two mandal codes | code-defects.csv, rechecked after the green table repair | Unchanged |
| Registry: 126 ULBs, 3 only in the CDMA files, 3 only in the MEPMA tables, 12 flagged | tools/build-registry.py | Confirmed |
| Each correction | The rows above | Confirmed |
