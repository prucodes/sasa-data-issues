# Fix pack

Most of the [data issues list](https://prucodes.github.io/sasa-data-issues/) can only be fixed by the people who own the data or run the platform. This folder is my attempt to make those fixes easier to pick up. None of it is approved. It is a starting point for the QA round, and I expect the owners to change it.

| File | What it is | Items |
|---|---|---|
| [`validate.mjs`](validate.mjs) | Eleven checks that can run on any Data Lake JSON response before it is accepted. No dependencies, Node 18 or later | C3, and the items each check names |
| [`validation-report.md`](validation-report.md) | The checks run on my copies of the data. [`validation-report.json`](validation-report.json) has every finding | All of the above |
| [`code-defects.csv`](code-defects.csv) | Every code problem I could confirm, one row each, with the dataset and the values involved | N4, N5, A2, A3, C1 |
| [`data-contract.md`](data-contract.md) | The fields each row and measure should carry, one name per concept, and how the API should behave | A1 to A14, B2 to B7, N1 to N8 |
| [`paging-evidence.md`](paging-evidence.md) | How to reproduce the paging and export fault, what I found, and a test that would show it is fixed | N1 |

## Running the checks

```
node validate.mjs <response.json | folder> [more ...] --md report.md --json report.json
```

A folder of `page-*.json` files is read as one dataset, so rows repeated across pages are counted. To name a dataset in the report, pass `"Label=folder"`.

A finding means a row cannot be accepted as it stands. The script never decides which value is right.

## What the report covers

The report was run on 14 September 2026 against:

1. the 36 small tables as I retrieved them on 10 and 11 September. For six of them (legacy waste clearance, compost pits, soak pits, magic drains, new IHHL identification and sewage), rows lost at a 100-row page boundary were recovered on 14 September with one-page filtered queries, so those six are complete;
2. door to door collection and waste segregation for 12 August, the one day I could retrieve complete by combining every route;
3. bulk waste generator identification and on site wet waste processing, from my paged pull on 8 September, which is incomplete (N1).

`code-defects.csv` was built from the same copies. Where an example also appears on the data issues page, I checked it again against these copies before including it.
