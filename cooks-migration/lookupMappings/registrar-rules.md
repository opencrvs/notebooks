All the unique registrars are here:
`cooks-migration/lookupMappings/allUniqueRegistrars.json`

I need to find the unique registrars from this list which contains types and punctuation differences.

Create a script which does the following:

Create a normalising function which:
- Uppercases
- Removes any text in parentheses
- Removes any special characters and numbers (except period .)
- Remove any instances of: D/REGISTRAR, REGISTRAR, DEPUTY, ACTING, CLERK, CHARGE CLERK IN CHARGE
- Trims whitespace
- Replace whitespace between characters with a period . but never allow multiple periods e.g. A..Harmer

Create a file, `cooks-migration/lookupMappings/generated/allRegistrars.json`
containing the unique normalised names.

Create file `cooks-migration/lookupMappings/generated/mappedRegistrars.json`
which contains the key of the un-normalised name with the value of the normalised name.

