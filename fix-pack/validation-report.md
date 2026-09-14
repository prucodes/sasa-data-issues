# SASA data checks

Checked 40 datasets on 2026-09-14 with `validate.mjs`. Each number counts rows, values or groups that could not be accepted as they stand. Repeated rows are counted once, except under N1 and N7.

| Dataset | Rows | N1 | N7 | A14 | N8 | A5 | N6 | C3 | A1 | N5 C1 | N4 | A3 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| cd_waste_process_plants_revival_new1_api | 6 |  |  |  | 3 |  |  |  |  |  |  |  |
| compost_pits_api | 336 |  | 3 |  | 26 |  |  |  |  |  |  |  |
| construction_of_csc_api | 84 |  |  |  |  |  |  |  |  |  |  |  |
| fstps_stps_cotreatment_new1_api | 70 |  |  |  |  | 35 |  |  | 5 | 8 |  |  |
| housing_construction_of_ihhls_new1_api | 84 |  |  |  |  |  |  |  |  |  |  |  |
| ihhl_new_identification_new1_api | 246 |  | 2 |  | 121 |  |  |  | 14 | 44 | 1 |  |
| itc_wow_schools_api | 24 |  |  |  |  |  |  |  |  |  |  |  |
| magic_drains_api | 336 |  | 2 |  | 83 |  |  |  |  |  |  |  |
| msw_cbg_units_new1_api | 12 |  |  |  | 6 |  |  |  | 4 | 2 |  |  |
| sasa_100_percent_clearance_of_legacy_waste_api | 246 |  | 3 |  | 94 |  |  | 561 |  |  |  |  |
| sasa_50_percent_green_spaces_api | 400 |  | 5 |  |  |  |  |  | 12 | 40 | 2 |  |
| sasa_50_percent_greencover_api | 400 |  | 5 |  |  |  |  |  | 12 | 40 | 2 |  |
| sasa_50_percent_rejuvenation_api | 400 |  | 5 |  |  |  |  |  | 12 | 40 | 2 |  |
| sasa_cdma_ulbs_ewaste_collection_mechanism_api | 26 |  |  |  |  |  |  |  |  |  |  |  |
| sasa_cdma_ulbs_single_use_plastic_ban_api | 26 |  |  |  |  |  |  |  |  |  |  |  |
| sasa_declaration_of_odf_plus_model_villages_api | 28 |  |  |  |  |  |  |  |  |  |  |  |
| sasa_establishment_of_gobardhan_units_api | 28 |  |  |  |  |  |  |  |  |  |  |  |
| sasa_establishment_of_plastic_waste_management_units_api | 28 |  |  |  |  |  |  |  |  |  |  |  |
| sasa_households_promoted_for_terrace_gardening_kitchen_gardens_api | 615 |  |  |  |  |  |  |  | 2 |  |  |  |
| sasa_mepma_entrepreneurs_promoted_for_circular_economy_api | 615 |  |  |  |  |  |  |  | 2 |  |  |  |
| sasa_mepma_households_promoted_for_home_composite_api | 615 |  |  |  |  |  |  |  | 2 |  |  |  |
| sasa_pr_no_of_swpcs_operationalised_api_27_aug_2026 | 56 |  | 28 |  |  |  |  |  |  |  |  |  |
| sasa_sac_door_to_door_e_autos_api | 84 |  |  |  | 56 |  |  |  | 8 |  |  |  |
| sasa_sac_door_to_door_push_carts_api | 84 |  |  |  | 56 |  |  |  | 8 |  |  |  |
| sasa_sac_door_to_door_tri_cycles_api | 84 |  |  |  | 56 |  |  |  | 8 |  |  |  |
| sasa_sac_machinery_compactors_api | 24 |  |  |  | 12 |  |  |  |  |  |  |  |
| sasa_sac_machinery_e_autos_service_model_api | 84 |  |  |  | 56 |  |  |  | 8 |  |  |  |
| sasa_sac_msw_processing_facilities_iswm_facilities_api | 216 |  |  |  | 108 |  |  |  |  |  |  |  |
| sasa_sac_sweeping_machines_information_api | 28 |  |  | 2 | 13 |  |  |  |  |  |  |  |
| sbm_construction_of_ihhls_new1_api | 84 |  |  |  |  |  |  |  |  |  |  |  |
| serp_circular_economy_api | 28 |  |  |  |  |  |  |  |  |  |  |  |
| serp_kitchen_garden_api | 28 |  |  |  |  |  |  |  |  |  |  |  |
| serp_swachhata_awareness_api | 28 |  |  |  |  |  |  |  |  |  |  |  |
| sewage_treated_qty_new1_api | 242 |  | 6 |  |  |  |  |  | 25 |  | 2 |  |
| soak_pits_api | 336 |  | 3 |  | 26 |  |  |  |  |  |  |  |
| swacch_survekshan_info_new1_api | 206 |  |  |  |  |  | 3 |  | 16 | 12 | 3 |  |
| msw_door_to_door_collection_api (12 August, complete) | 4,023 |  |  |  |  |  |  |  |  | 51 | 1 | 3,917 |
| waste_egregation_api (12 August, complete) | 4,023 |  |  |  |  |  |  |  |  | 51 | 1 | 3,917 |
| identification_of_bulk_waste_generators_api (8 September paged pull) | 64,528 | 23,701 |  |  |  |  | 23 |  |  | 796 | 1 | 39,738 |
| onsite_processing_of_wet_waste_bwg_api (8 September paged pull) | 64,528 | 23,701 |  |  |  |  |  |  |  | 796 | 1 | 39,738 |

## What each column checks

* **N1**, `response.reconcile`: Pages return the reported total, but part of it repeats.
* **N7**, `row.exact-duplicate`: The same row appears more than once.
* **A14**, `row.conflicting-duplicate`: The same place and period with different numbers.
* **N8**, `month.carried-forward`: Almost every place repeats the previous month exactly.
* **A5**, `period.mismatch`: Month number and month name disagree.
* **N6**, `count.not-number`: Text in a column that otherwise holds numbers.
* **C3**, `number.stored-as-text`: Numbers stored as text, with quote marks or thousands separators.
* **A1**, `text.quote-marks`: Quote marks left inside a text value.
* **N5 C1**, `code.missing`: A code is blank or the text NULL where the rest of the file has one.
* **N4**, `code.label-to-many`: One district label carries more than one district code in the same file.
* **A3**, `code.ulb-is-mandal`: ulb_code holds the mandal code.

## Examples

### cd_waste_process_plants_revival_new1_api

* 2026-06 to 2026-07: identical for 3 of 3 places.
* N8, Almost every place repeats the previous month exactly: 3. Example: `{"months":"2026-06 to 2026-07","identical":3,"places":3}`

### compost_pits_api

* 2026-06 to 2026-07: identical for 23 of 27 places.
* 2026-04 to 2026-05: identical for 25 of 27 places.
* 2026-07 to 2026-08: identical for 26 of 27 places.
* 2026-05 to 2026-06: identical for 25 of 27 places.
* N7, The same row appears more than once: 3. Example: `{"row":200,"sameAs":197}`
* N8, Almost every place repeats the previous month exactly: 26. Example: `{"months":"2026-07 to 2026-08","identical":26,"places":27}`

### construction_of_csc_api

* 2026-05 to 2026-06: identical for 2 of 28 places.
* 2026-06 to 2026-07: identical for 3 of 28 places.

### fstps_stps_cotreatment_new1_api

* A5, Month number and month name disagree: 35. Example: `{"row":0,"name":"JUNE","number":"7"}`
* A1, Quote marks left inside a text value: 5. Example: `{"column":"dstrt_nm","value":"\"YSR Kadapa\""}`
* N5 C1, A code is blank or the text NULL where the rest of the file has one: 8. Example: `{"row":62,"columns":["lgd_dist_code","lgd_mandal_code"],"label":"NTR"}`

### housing_construction_of_ihhls_new1_api

* 2026-06 to 2026-07: identical for 1 of 28 places.
* 2026-05 to 2026-06: identical for 1 of 28 places.

### ihhl_new_identification_new1_api

* 2026-06 to 2026-07: identical for 121 of 121 places.
* N7, The same row appears more than once: 2. Example: `{"row":200,"sameAs":196}`
* N8, Almost every place repeats the previous month exactly: 121. Example: `{"months":"2026-06 to 2026-07","identical":121,"places":121}`
* A1, Quote marks left inside a text value: 14. Example: `{"column":"dstrt_nm","value":"\"YSR Kadapa\""}`
* N5 C1, A code is blank or the text NULL where the rest of the file has one: 44. Example: `{"row":200,"columns":["lgd_dist_code","lgd_mandal_code"],"label":"Kurnool"}`
* N4, One district label carries more than one district code in the same file: 1. Example: `{"labelColumn":"dstrt_nm","label":"Annamayya","codeColumn":"lgd_dist_code","codes":["504","753"]}`

### magic_drains_api

* 2026-04 to 2026-05: identical for 27 of 28 places.
* 2026-07 to 2026-08: identical for 28 of 28 places.
* 2026-05 to 2026-06: identical for 26 of 28 places.
* 2026-06 to 2026-07: identical for 28 of 28 places.
* N7, The same row appears more than once: 2. Example: `{"row":100,"sameAs":98}`
* N8, Almost every place repeats the previous month exactly: 83. Example: `{"months":"2026-04 to 2026-05","identical":27,"places":28}`

### msw_cbg_units_new1_api

* 2026-06 to 2026-07: identical for 6 of 6 places.
* N8, Almost every place repeats the previous month exactly: 6. Example: `{"months":"2026-06 to 2026-07","identical":6,"places":6}`
* A1, Quote marks left inside a text value: 4. Example: `{"column":"status_tx","value":"\"In Progress\""}`
* N5 C1, A code is blank or the text NULL where the rest of the file has one: 2. Example: `{"row":10,"columns":["lgd_dist_code","lgd_mandal_code"],"label":"\"East Godavari\""}`

### sasa_100_percent_clearance_of_legacy_waste_api

* 2026-06 to 2026-07: identical for 94 of 97 places.
* N7, The same row appears more than once: 3. Example: `{"row":200,"sameAs":197}`
* N8, Almost every place repeats the previous month exactly: 94. Example: `{"months":"2026-06 to 2026-07","identical":94,"places":97}`
* C3, Numbers stored as text, with quote marks or thousands separators: 561. Example: `{"column":"target","example":"\"36,400\""}`

### sasa_50_percent_green_spaces_api

* 2026-06 to 2026-07: identical for 157 of 192 places.
* N7, The same row appears more than once: 5. Example: `{"row":101,"sameAs":99}`
* A1, Quote marks left inside a text value: 12. Example: `{"column":"dstrt_nm","value":"\"East Godavari\""}`
* N5 C1, A code is blank or the text NULL where the rest of the file has one: 40. Example: `{"row":355,"columns":["lgd_dist_code","lgd_mandal_code"],"label":"\"Parvathipuram Manyam\""}`
* N4, One district label carries more than one district code in the same file: 2. Example: `{"labelColumn":"dstrt_nm","label":"Annamayya","codeColumn":"lgd_dist_code","codes":["504","753"]}`

### sasa_50_percent_greencover_api

* 2026-06 to 2026-07: identical for 157 of 192 places.
* N7, The same row appears more than once: 5. Example: `{"row":101,"sameAs":99}`
* A1, Quote marks left inside a text value: 12. Example: `{"column":"dstrt_nm","value":"\"East Godavari\""}`
* N5 C1, A code is blank or the text NULL where the rest of the file has one: 40. Example: `{"row":355,"columns":["lgd_dist_code","lgd_mandal_code"],"label":"\"Parvathipuram Manyam\""}`
* N4, One district label carries more than one district code in the same file: 2. Example: `{"labelColumn":"dstrt_nm","label":"Annamayya","codeColumn":"lgd_dist_code","codes":["504","753"]}`

### sasa_50_percent_rejuvenation_api

* 2026-06 to 2026-07: identical for 157 of 192 places.
* N7, The same row appears more than once: 5. Example: `{"row":101,"sameAs":99}`
* A1, Quote marks left inside a text value: 12. Example: `{"column":"dstrt_nm","value":"\"East Godavari\""}`
* N5 C1, A code is blank or the text NULL where the rest of the file has one: 40. Example: `{"row":355,"columns":["lgd_dist_code","lgd_mandal_code"],"label":"\"Parvathipuram Manyam\""}`
* N4, One district label carries more than one district code in the same file: 2. Example: `{"labelColumn":"dstrt_nm","label":"Annamayya","codeColumn":"lgd_dist_code","codes":["504","753"]}`

### sasa_households_promoted_for_terrace_gardening_kitchen_gardens_api

* 2026-06 to 2026-07: identical for 37 of 123 places.
* 2026-04 to 2026-05: identical for 84 of 123 places.
* 2026-03 to 2026-04: identical for 28 of 123 places.
* 2026-05 to 2026-06: identical for 32 of 123 places.
* A1, Quote marks left inside a text value: 2. Example: `{"column":"ulb_name","value":"\"JANGAREDDY GUDEM\""}`

### sasa_mepma_entrepreneurs_promoted_for_circular_economy_api

* 2026-06 to 2026-07: identical for 63 of 118 places.
* 2026-04 to 2026-05: identical for 73 of 118 places.
* 2026-03 to 2026-04: identical for 95 of 118 places.
* 2026-05 to 2026-06: identical for 55 of 118 places.
* A1, Quote marks left inside a text value: 2. Example: `{"column":"ulb_name","value":"\"JANGAREDDY GUDEM\""}`

### sasa_mepma_households_promoted_for_home_composite_api

* 2026-06 to 2026-07: identical for 36 of 123 places.
* 2026-04 to 2026-05: identical for 13 of 123 places.
* 2026-03 to 2026-04: identical for 31 of 123 places.
* 2026-05 to 2026-06: identical for 11 of 123 places.
* A1, Quote marks left inside a text value: 2. Example: `{"column":"ulb_name","value":"\"JANGAREDDY GUDEM\""}`

### sasa_pr_no_of_swpcs_operationalised_api_27_aug_2026

* N7, The same row appears more than once: 28. Example: `{"row":1,"sameAs":0}`

### sasa_sac_door_to_door_e_autos_api

* 2026-05 to 2026-06: identical for 28 of 28 places.
* 2026-06 to 2026-07: identical for 28 of 28 places.
* N8, Almost every place repeats the previous month exactly: 56. Example: `{"months":"2026-05 to 2026-06","identical":28,"places":28}`
* A1, Quote marks left inside a text value: 8. Example: `{"column":"dstrt_nm","value":"\"Y.S.R. KADAPA\""}`

### sasa_sac_door_to_door_push_carts_api

* 2026-05 to 2026-06: identical for 28 of 28 places.
* 2026-06 to 2026-07: identical for 28 of 28 places.
* N8, Almost every place repeats the previous month exactly: 56. Example: `{"months":"2026-05 to 2026-06","identical":28,"places":28}`
* A1, Quote marks left inside a text value: 8. Example: `{"column":"dstrt_nm","value":"\"Y.S.R. KADAPA\""}`

### sasa_sac_door_to_door_tri_cycles_api

* 2026-05 to 2026-06: identical for 28 of 28 places.
* 2026-06 to 2026-07: identical for 28 of 28 places.
* N8, Almost every place repeats the previous month exactly: 56. Example: `{"months":"2026-05 to 2026-06","identical":28,"places":28}`
* A1, Quote marks left inside a text value: 8. Example: `{"column":"dstrt_nm","value":"\"Y.S.R. KADAPA\""}`

### sasa_sac_machinery_compactors_api

* 2026-06 to 2026-07: identical for 12 of 12 places.
* N8, Almost every place repeats the previous month exactly: 12. Example: `{"months":"2026-06 to 2026-07","identical":12,"places":12}`

### sasa_sac_machinery_e_autos_service_model_api

* 2026-05 to 2026-06: identical for 28 of 28 places.
* 2026-06 to 2026-07: identical for 28 of 28 places.
* N8, Almost every place repeats the previous month exactly: 56. Example: `{"months":"2026-05 to 2026-06","identical":28,"places":28}`
* A1, Quote marks left inside a text value: 8. Example: `{"column":"dstrt_nm","value":"\"Y.S.R. KADAPA\""}`

### sasa_sac_msw_processing_facilities_iswm_facilities_api

* 2026-06 to 2026-07: identical for 108 of 108 places.
* N8, Almost every place repeats the previous month exactly: 108. Example: `{"months":"2026-06 to 2026-07","identical":108,"places":108}`

### sasa_sac_sweeping_machines_information_api

* 2026-06 to 2026-07: identical for 13 of 13 places.
* A14, The same place and period with different numbers: 2. Example: `{"key":[["district_name","SPSR Nellore"],["ulb_name","Nellore"],["month_number","6"],["month_name","JUNE"],["year","2026"],["fin_year","2026-2027"]],"variants":2}`
* N8, Almost every place repeats the previous month exactly: 13. Example: `{"months":"2026-06 to 2026-07","identical":13,"places":13}`

### sbm_construction_of_ihhls_new1_api

* 2026-06 to 2026-07: identical for 11 of 28 places.

### sewage_treated_qty_new1_api

* N7, The same row appears more than once: 6. Example: `{"row":100,"sameAs":99}`
* A1, Quote marks left inside a text value: 25. Example: `{"column":"pckg_nm","value":"\"STPs Package-II\""}`
* N4, One district label carries more than one district code in the same file: 2. Example: `{"labelColumn":"dstrt_nm","label":"Chittoor","codeColumn":"lgd_dist_code","codes":["503","753"]}`

### soak_pits_api

* 2026-06 to 2026-07: identical for 23 of 27 places.
* 2026-04 to 2026-05: identical for 25 of 27 places.
* 2026-07 to 2026-08: identical for 26 of 27 places.
* 2026-05 to 2026-06: identical for 25 of 27 places.
* N7, The same row appears more than once: 3. Example: `{"row":200,"sameAs":197}`
* N8, Almost every place repeats the previous month exactly: 26. Example: `{"months":"2026-07 to 2026-08","identical":26,"places":27}`

### swacch_survekshan_info_new1_api

* N6, Text in a column that otherwise holds numbers: 3. Example: `{"row":37,"column":"national_rank","value":"SSL"}`
* A1, Quote marks left inside a text value: 16. Example: `{"column":"gfc_status","value":"\"No Star\""}`
* N5 C1, A code is blank or the text NULL where the rest of the file has one: 12. Example: `{"row":194,"columns":["lgd_dist_code","lgd_mandal_code"],"label":"Palnadu"}`
* N4, One district label carries more than one district code in the same file: 3. Example: `{"labelColumn":"dstrt_nm","label":"Kurnool","codeColumn":"lgd_dist_code","codes":["510","511"]}`

### msw_door_to_door_collection_api (12 August, complete)

* N5 C1, A code is blank or the text NULL where the rest of the file has one: 51. Example: `{"row":121,"columns":["district_code"],"label":"Markapuram"}`
* N4, One district label carries more than one district code in the same file: 1. Example: `{"labelColumn":"district_name","label":"Visakhapatnam","codeColumn":"api_lgd_dist_code","codes":["520","744"]}`
* A3, ulb_code holds the mandal code: 3,917. Example: `{"same":3917,"of":4023}`

### waste_egregation_api (12 August, complete)

* N5 C1, A code is blank or the text NULL where the rest of the file has one: 51. Example: `{"row":121,"columns":["district_code"],"label":"Markapuram"}`
* N4, One district label carries more than one district code in the same file: 1. Example: `{"labelColumn":"district_name","label":"Visakhapatnam","codeColumn":"api_lgd_dist_code","codes":["520","744"]}`
* A3, ulb_code holds the mandal code: 3,917. Example: `{"same":3917,"of":4023}`

### identification_of_bulk_waste_generators_api (8 September paged pull)

* N1, Pages return the reported total, but part of it repeats: 23,701. Example: `{"returned":64528,"distinct":40827,"repeatedShare":0.3673}`
* N6, Text in a column that otherwise holds numbers: 23. Example: `{"row":26813,"column":"no_of_bwgs","value":" Prakash Nagar"}`
* N5 C1, A code is blank or the text NULL where the rest of the file has one: 796. Example: `{"row":40031,"columns":["district_code"],"label":"Markapuram"}`
* N4, One district label carries more than one district code in the same file: 1. Example: `{"labelColumn":"district_name","label":"Visakhapatnam","codeColumn":"api_lgd_dist_code","codes":["520","744"]}`
* A3, ulb_code holds the mandal code: 39,738. Example: `{"same":39738,"of":40827}`

### onsite_processing_of_wet_waste_bwg_api (8 September paged pull)

* N1, Pages return the reported total, but part of it repeats: 23,701. Example: `{"returned":64528,"distinct":40827,"repeatedShare":0.3673}`
* N5 C1, A code is blank or the text NULL where the rest of the file has one: 796. Example: `{"row":40031,"columns":["district_code"],"label":"Markapuram"}`
* N4, One district label carries more than one district code in the same file: 1. Example: `{"labelColumn":"district_name","label":"Visakhapatnam","codeColumn":"api_lgd_dist_code","codes":["520","744"]}`
* A3, ulb_code holds the mandal code: 39,738. Example: `{"same":39738,"of":40827}`

