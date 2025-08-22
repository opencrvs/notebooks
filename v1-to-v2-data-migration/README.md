# OpenCRVS Events v1.0 to v2.0 data migration

## Steps to run

- Start your environment locally for the country you want to migrate
- Run `./get-field-diff.ipynb`
- The output will tell you which fields you have not mapped or resolved:
  - "Unmapped V1 fields":
    - Add the field mapping to `./helpers/countryMappings`
  - "V1 form fields mapped to a V2 field that does not exist":
    - Override the field default mapping in `./helpers/countryMappings`
  - "V1 form fields mapped but V2 field does not have a resolver":
    - Add custom resolvers to `./helpers/countryResolvers`
- Once you get "Ok to proceed with migration" 
  - Run `./fetch-and-transform-all.ipynb`
- If the migration is successful, it will print out a list of successful migrations


## Findings

- "Duplicates" array Task fetching might have to be added to MongoDB query
https://github.com/opencrvs/opencrvs-core/blob/4ae4da9d7a00ffb85a15012fcdcc2d3ec473ec4f/packages/gateway/src/features/registration/type-resolvers.ts#L1142-L1151
- getTimeLogged
- Users need to be handled
  - primaryOffice location should be lifted in the bundle
  - Might be needed to migrate Practitioner primary offices into Practitioner objects before the actual migration


  practitioner Role history bug also affects this


- Questionnaire wasn't part of the legacy data (no custom questions?)

- OK I'm missing history


# Step
1. Read country's current form, gather a list of fields with
  - Custom: true
  - Field: type
2. Make an analysis of possible misalignment
3. Migrate locations from FHIR Location to Postgres