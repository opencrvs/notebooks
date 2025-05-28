# OpenCRVS Events v1.0 to v2.0 data migration

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