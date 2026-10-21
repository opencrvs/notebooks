# V1 to V2 Data Migration UI Tests

This repository contains Playwright-based UI tests for verifying the correctness of migrated birth and death records between V1 and V2 systems.

## Directory Structure

```
notebooks/
  v1-to-v2-data-migration/
  ui-tests/
      tests/
        birth-migrated-records.spec.ts
        death-migrated-records.spec.ts
      helpers.ts
      constants.ts
      README.md
```

## Overview

- **Birth Record Tests:**  
  Located in `ui-tests/tests/birth-migrated-records.spec.ts`, these tests verify that birth records migrated from V1 to V2 are accurate and complete.
- **Death Record Tests:**  
  Located in `ui-tests/tests/death-migrated-records.spec.ts`, these tests perform similar checks for death records.

## Test Features

- **Authentication:**  
  Tests log in as a local registrar using credentials defined in `constants.ts` and helper functions in `helpers.ts`.
- **Field Mapping:**  
  Each test captures V1 field values in the record view page and maps them to their corresponding V2 fields using mapping objects.
- **Automated Comparison:**  
  The suite compares each field between V1 and V2, collecting all mismatches and reporting them together for easier debugging.
- **Error Detection:**  
  Tests check for invalid inputs and missing required fields in migrated records.

## Running dependencies

1. **Start your local opencrvs stack:**
   - Ensure the opencrvs application is running and accessible.
   - Create a few birth and death records using the V1 side.

2. **Run the data migration notebooks:**
    - Run all the code cells in `migrate.ipynb` to migrate all the V1 records to V2 side.

## Running the tests to verify migration of records

1. **Install dependencies:**
   cd into the ui-tests directory
   ```sh
   yarn install
   ```

2. **Record IDs:**
   Update the `recordId` variables in the test files to point to the records you wish to verify. 

3. **Run the tests in UI mode:**
   ```sh
   yarn e2e-dev
   ```
   Once you launch UI Mode you will see a list of the test files. You can run a single test file by clicking the triangle icon in the sidebar.

   Tests can be skipped by using the `test.skip()` function in case, UI differences (but not data differences) in core are causing failures.

4. While developing console.logs are useful to verify the captured fields and data, but make sure to remove them so PII data is not logged in CI logs, etc. 

5. For the same reason, the `expect()` function from playwright should not be used to assert the actual declaration data, as it will log PII data in case of assertions failing. 

## Output

- Assertion failures are collated and reported together (in the Errors tab in Playwright UI Mode), listing only the fields (and not the underlying data) that do not match between V1 and V2. Example error output that the tests generate: `Mismatch in child.dob field`
- Console logs provide details on captured field values and IDs for debugging during development (in the Console tab in Playwright UI Mode).

