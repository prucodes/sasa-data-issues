# Paging and export evidence (N1)

The CDMA daily files come back with the right row count but not the right rows. This note is written so the platform team can reproduce it without me. The figures below come from a capture on 14 September 2026 that kept every request, response ID and response hash, in [`evidence/n1-2026-09-14`](evidence/n1-2026-09-14). The whole-file paging figures are from my paging pull on 8 September.

## What the file should hold

`msw_door_to_door_collection_api` has one row per secretariat per day. 4,023 secretariats over 16 days (12 to 27 August) is 64,368 rows, which is exactly the `totalRecordCount` the API reports. Waste segregation reports the same 64,368. Bulk waste generator identification and wet waste processing report 64,528.

## How to reproduce

**Paging.** Send the query with an offset page token and walk to the end. `pageSize` is ignored, so each page is 100 rows.

```
POST /api/v1/datasets/msw_door_to_door_collection_api/query
{"departmentId":"DEPT-AILABS","purpose":"BENEFIT_DISBURSEMENT","filters":{},"responseFormat":"JSON","pageToken":"<base64 of {\"mode\":\"offset\",\"value\":N}>"}
```

**Export.** One call per district code gives the whole filtered result in one response.

```
POST /api/v1/datasets/msw_door_to_door_collection_api/export?format=json
{"departmentId":"DEPT-AILABS","purpose":"BENEFIT_DISBURSEMENT","filters":{"district_code":"520"},"responseFormat":"JSON"}
```

**Count.** Count distinct `(date1, sachivalayam_code)` pairs, or `(date1, secretariat_code)` for bulk waste generators and wet waste processing. `node validate.mjs <folder of pages>` also reports returned rows against distinct rows.

## What I found

| Check | Rows returned | Distinct rows |
|---|---:|---:|
| Paging, whole file, 8 September | 64,368 | 40,636 |
| Export, all 26 district codes, 14 September | 64,368 | 32,206 |
| Everything I hold, every route combined | | 50,477 (78.4%) |

1. **The two routes miss different rows.** In Visakhapatnam (district code 520) export gave 4,614 distinct rows of 9,216 and paging gave 5,067. Only 2,741 were in both.
2. **Repeating a route does not help.** Exported twice on 14 September, Anantapuram (502), Chittoor (503) and Markapuram (`NULL`) returned the same rows, repeated the same number of times: 1,439 of 2,880, 739 of 1,472 and 409 of 816. Paging Anantapuram and Chittoor with the district filter returned exactly the same distinct rows as their exports. The export across all 26 codes gave 32,206 distinct rows, the same count as on 11 September.
3. **It is not the data changing between pulls.** On 14 September, 1,766 of the 3,915 distinct rows on 40 unfiltered pages spread across the file were not in that day's export.
4. **Every CDMA daily file behaves the same way.** By export, waste segregation returned 32,206 distinct rows of 64,368, bulk waste generator identification 32,286 of 64,528, and wet waste processing 32,286 of 64,528. All 64,368 segregation rows match a collection row on every column they share.
5. **The gaps are uneven by day.** Across every route, 12 August is complete for every secretariat, 1 row is missing for 13 August and 2,860 for 27 August.

## Evidence

In [`evidence/n1-2026-09-14`](evidence/n1-2026-09-14):

- `summary.json`: for each of the four files and each district code, the rows returned, distinct rows, reported total, HTTP status, response ID, generation time and SHA-256 of the response; the rows each route contributed, the union, and the rows missing on each day. It also holds the A3, A13 and N6 counts quoted on the data issues page.
- `district_code-502` and `district_code-503`: both exports and the full district paging for Anantapuram and Chittoor, raw, with the request bodies.
- `live-checks.json`: the other live checks run on 14 September, including the Markapuram export run twice, page size, filter errors, purposes and row totals.

The raw exports for all 26 district codes of the four files come to 99 MB, too large for this repository. I have kept them and can share them.

## A test that would show it is fixed

For each of the four CDMA daily files, and for both paging and export:

1. returned rows equal `totalRecordCount`;
2. distinct `(secretariat_code, date1)` pairs equal `totalRecordCount`;
3. two runs of the same request return the same set of rows.

My guess is that the query underneath has no fixed sort order, so each page is cut from a different ordering. I cannot confirm that from outside. I can re-capture the exact requests and response IDs for any district on request.
