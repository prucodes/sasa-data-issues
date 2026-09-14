# Paging and export evidence (N1)

The CDMA daily files come back with the right row count but not the right rows. This note is written so the platform team can reproduce it without me. Figures are from my checks on 8, 11 and 12 September 2026.

## What the file should hold

`msw_door_to_door_collection_api` has one row per secretariat per day. 4,023 secretariats over 16 days (12 to 27 August) is 64,368 rows, which is exactly the `totalRecordCount` the API reports.

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

**Count.** Count distinct `(sachivalayam_code, date1)` pairs, or run `node validate.mjs <folder of pages>`, which reports returned rows against distinct rows.

## What I found

| Check | Rows returned | Distinct rows |
|---|---:|---:|
| Paging, whole file, 8 September | 64,368 | 40,636 |
| Export, all 26 district codes, 11 September | 64,368 | 32,206 |
| Every route combined | | 50,634 (78.7%) |

1. **The two routes miss different rows.** In Visakhapatnam (district code 520) export gave 4,614 distinct rows and paging gave 5,067. Only 2,741 were in both.
2. **Repeating a route does not help.** A second full paging pass over Visakhapatnam added no new rows. Exporting six districts a second time returned the same rows, repeated the same number of times: 1,439 of 2,880 in Anantapuram, 4,614 of 9,216 in Visakhapatnam.
3. **It is not the data changing between pulls.** On 11 September, 2,104 of 3,947 distinct rows paged across the file were not in that day's export.
4. **It affects the other daily files the same way.** Waste segregation and wet waste processing returned 12,507 of 25,024 and 12,539 of 25,088 distinct rows in the same six districts, 50.0% each. Bulk waste generator identification returned 32,286 distinct of 64,528 by export.
5. **The gaps are uneven by day.** 12 August comes back complete for every secretariat. On 27 August 2,858 rows are missing across all routes.

## A test that would show it is fixed

For each of the four CDMA daily files, and for both paging and export:

1. returned rows equal `totalRecordCount`;
2. distinct `(secretariat_code, date1)` pairs equal `totalRecordCount`;
3. two runs of the same request return the same set of rows.

My guess is that the query underneath has no fixed sort order, so each page is cut from a different ordering. I cannot confirm that from outside. I can re-capture the exact requests and response IDs for any district on request.
