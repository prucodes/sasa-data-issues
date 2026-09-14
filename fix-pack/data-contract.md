# A proposed data contract for SASA datasets

This is a proposal, not an agreed standard. It collects, in one place, the fields and API behaviour that would close most of the items on the data issues list. Each part names the items it would fix. I have kept it to what I needed while building SASA Intelligence Lab, so the owners of the data will know better where it needs to change.

## 1. Every row

| Field | What it holds | Fixes |
|---|---|---|
| `record_id` | A stable ID for the row, kept across reloads | A8, A14 |
| `revision` | 1 for the first submission, then 2, 3 and so on when the row is corrected | A8, N2 |
| `submitted_at` | When the value was entered by whoever reported it, not when the file was loaded | A8, N8 |
| `carried_forward` | `true` when the value was copied from the previous period and not reported again | N8 |
| `period_start`, `period_end` | ISO dates. A day has the same start and end. A month runs from its first to its last day | A5, B1, B7 |
| `measure_basis` | One of `MONTHLY`, `CUMULATIVE_FINANCIAL_YEAR`, `CUMULATIVE_TO_DATE`, `SNAPSHOT` | A6 |
| `lgd_district_code` | The LGD district code, and nothing else under that name | A2, A7, N4, N5 |
| `lgd_local_body_code` | The LGD urban local body code for ULB rows. Not the mandal code | A1, A3, C1 |
| `secretariat_code` or `gram_panchayat_code` | For rows below ULB or block level | A7 |
| `source_label` | The name as the department wrote it, kept for reference only, never used as a key | A1, N4 |

Housekeeping columns such as `active_indicator`, `i_ts`, `a_in`, `s_no` and `u_ts` should either be documented or left out of the published table (A10).

## 2. Every measure

| Field | What it holds | Fixes |
|---|---|---|
| `value` | The number, or empty when there is no observation | A4, A13, C2 |
| `missing_reason` | Required when `value` is empty: `NOT_REPORTED`, `NOT_APPLICABLE` or `WITHHELD` | A4, A13, C2 |
| `unit` | For example households, tonnes, vehicles, kilolitres per day | A9 |
| `denominator` | The name of the measure it is a share of, where it is a share | A6 |

A zero means zero was observed. It should never stand in for a missing report.

## 3. One name per concept

These are the names I found for the same thing across files that are published together. The proposal is to keep only the name on the right.

| Found in the data | Proposed name | Fixes |
|---|---|---|
| `lgd_dist_code`, `lgd_district_code`, `api_lgd_dist_code`, `district_code` | `lgd_district_code` | A7, B7 |
| `dstrt_nm`, `district_name`, `lgd_district_name`, `api_district_name` | `source_label` for the department's spelling, and the LGD name from the LGD master | A1, A7 |
| `ulb_code`, `lgd_mandal_code`, `api_lgd_mandal_code` | `lgd_local_body_code` for the ULB. A mandal code only where the row really is a mandal | A3 |
| `ulb_nm`, `ulb_name`, `ulb`, `api_mandal_name` | `source_label` | A1, A7 |
| `month_id`, `mnth_no`, `month_number`, `month_no`, `MONTH_ID`, `mnth_nm`, `month_name`, `date1`, `COLLECTION_DATE` | `period_start` and `period_end` | A5, A7, B1 |
| `year`, `YEAR`, `fin_year`, `financial_year` | Derived from the period, not stored separately | A5 |
| `sachivalayam_code`, `secretariat_code` | `secretariat_code` | A7 |
| Filters `month`, `month_id`, `mnth_no`, `year`, `district_code` | Filters `period_start`, `period_end`, `lgd_district_code` | B7 |

## 4. Before a submission is accepted

The checks in `validate.mjs` are a starting point (C3). A submission would be sent back when:

1. a code column is blank or holds the text NULL (N5);
2. a count column holds text (N6);
3. a name holds quote marks, which usually means a field was split at a comma (A1, N6);
4. the month number and month name disagree (A5);
5. the same place and period appears twice with different numbers (A14);
6. a row repeats exactly (N7);
7. a month is identical to the previous month for every place, unless each row is marked `carried_forward` (N8);
8. one department label carries two different LGD codes in the same file (N4).

## 5. The API

| Behaviour | Proposal | Fixes |
|---|---|---|
| Paging and export | Every row returned exactly once by both routes, on a fixed sort order. The acceptance test is in `paging-evidence.md` | N1 |
| Page size | A `pageSize` that is honoured, up to at least 5,000 rows | B4 |
| Change signal | An ETag that is a hash of the rows, so it only changes when the data does | B6 |
| Key lifecycle | A new key when a key starts returning a different table. The old key answers with a notice naming its successor | N2 |
| Shared tables | One key per table, or the catalogue says which keys share one | N3 |
| Filter with no match | HTTP 200 with zero rows, not a 502 | B2 |
| Catalogue | Allowed purposes, filter names, expected entities and the periods each dataset should cover | A11, B5 |
| History | Earlier periods kept, or published under their own key | N2 |

## 6. Codes

`code-defects.csv` lists every code problem I could confirm in the retained copies, with the dataset and the values involved. The permanent ULB ID (A1) and the choice of LGD code (C1) are decisions for the department and TCS together. I can share the candidate list I built for the app if it helps, but it is a list of name matches for review, not an approved crosswalk.
