# Fix pack

Most of the [data issues list](https://prucodes.github.io/sasa-data-issues/) can only be fixed by the people who own the data or run the platform. This folder is my attempt to make those fixes easier to pick up. None of it is approved. It is a starting point for the QA round, and I expect the owners to change it.

| File | What it is | Items |
|---|---|---|
| [`validate.mjs`](validate.mjs) | Eleven checks that can run on any Data Lake JSON response before it is accepted. No dependencies, Node 18 or later | C3, and the items each check names |
| [`validation-report.md`](validation-report.md) | The checks run on my copies of the data. [`validation-report.json`](validation-report.json) has every finding | All of the above |
| [`code-defects.csv`](code-defects.csv) | Every code problem I could confirm, one row each, with the dataset and the values involved | N4, N5, A2, A3, C1 |
| [`ulb-registry-proposed.csv`](ulb-registry-proposed.csv) | One row per ULB: the 123 in the MEPMA tables and 3 that only the CDMA daily files have, with the MEPMA ID, CDMA code, LGD codes and every spelling found. 12 matches are flagged for review. [`ulb-spellings-unresolved.csv`](ulb-spellings-unresolved.csv) has the one spelling I could not place, and [`tools/build-registry.py`](tools/build-registry.py) shows how each name was matched | A1, A3, A11, C1 |
| [`data-contract.md`](data-contract.md) | The fields each row and measure should carry, one name per concept, and how the API should behave | A1 to A14, B2 to B7, N1 to N8 |
| [`paging-evidence.md`](paging-evidence.md) | How to reproduce the paging and export fault, what I found on 14 September, and a test that would show it is fixed. Counts, response IDs and raw responses for two districts are in [`evidence/n1-2026-09-14`](evidence/n1-2026-09-14) | N1 |
| [`evidence/claims-check.md`](evidence/claims-check.md) | Where every figure on the data issues page comes from, and what I checked it against on 14 September | All |

## Running the checks

```
node validate.mjs <response.json | folder> [more ...] --md report.md --json report.json
```

A folder of `page-*.json` files is read as one dataset, so rows repeated across pages are counted. To name a dataset in the report, pass `"Label=folder"`.

A finding means a row cannot be accepted as it stands. The script never decides which value is right.

## What the report covers

The report was run on 14 September 2026 against:

1. the 36 small tables as I retrieved them on 9 and 10 September. In seven tables, rows lost at a 100-row page boundary were recovered on 14 September with one-page filtered queries, so those are complete: legacy waste clearance, compost pits, soak pits, magic drains, new IHHL identification, sewage, and the green programme table served under three keys;
2. door to door collection and waste segregation for 12 August, the one day I could retrieve complete by combining every route;
3. bulk waste generator identification and on site wet waste processing, from my paged pull on 8 September, which is incomplete (N1).

`code-defects.csv` was built from the same copies. Where an example also appears on the data issues page, I checked it again against these copies before including it.

**Corrected on 14 September.** The month repeat check (N8) now reads the month from the month number when the number and the name disagree, and treats record IDs and serial numbers as identifiers, not measures. Before that it missed the repeated months in sewage (121 plants) and FSTPs (35 plants).

## The copy of the data behind this

My saved copies are in the app repository, [prucodes/sasa-intelligence-lab](https://github.com/prucodes/sasa-intelligence-lab):

- [`data/current-snapshots`](https://github.com/prucodes/sasa-intelligence-lab/tree/main/data/current-snapshots): the 36 small tables as retrieved on 9 and 10 September;
- [`data/full-snapshots`](https://github.com/prucodes/sasa-intelligence-lab/tree/main/data/full-snapshots): older copies from 28 August and 8 September, including the ones that still have monthly history (N2);
- [`data/retention-repairs/2026-09-14`](https://github.com/prucodes/sasa-intelligence-lab/tree/main/data/retention-repairs/2026-09-14): the filtered responses used to recover rows lost at page boundaries. Each repaired file records what was removed and added under `retentionRepair`;
- [`DATA_PROVENANCE.md`](https://github.com/prucodes/sasa-intelligence-lab/blob/main/DATA_PROVENANCE.md): what was repaired, what could not be, and why.

Repaired means rows lost at page boundaries were put back, and the repeats that stood in for them removed. No source value was changed: names, codes and zeros are as the source sent them. The CDMA daily files are too large for the repository and are not included.
