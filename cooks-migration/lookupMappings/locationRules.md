### This file contains the instructions to map free text addresses with abundant typos to structured addresses in openCRVS

Locations can be:
- An address local to the cook islands
- A health facility in the cook islands
- An international address
- Invalid/rubbish data

OpenCRVS has a seeded admin structure which is the heirarchy of location levels in the cook islands, found here:
cooks-migration/lookupMappings/seededLocations.json
The locations heirarchy is denoted by the properties:
- admin{x}Pcode
- admin{x}Name_en

where 'x' is the level.

Health facilities are found here:
cooks-migration/lookupMappings/seededFacilities.json

A list of countries and their codes is here:
cooks-migration/helpers/addressConfig.ts

Locations to map: cooks-migration/lookupMappings/allUniqueAddresses.json
Which contains > 20000 lines

4 files will be created
- cooks-migration/lookupMappings/generated/local.json
- cooks-migration/lookupMappings/generated/facility.json
- cooks-migration/lookupMappings/generated/intl.json
- cooks-migration/lookupMappings/generated/garbage.json

For each entry in locations to map, in order:

#### Discard eroneous data (garbage.json)
Destination format: string

- Any entry with zero alphabetical characters is immediately invalid
- Add entry to garbage.ts

#### Attempt to map to facility (facility.json)
Destination format: `Record<name: string, code: string>`
e.g. `"AITUTAKI HOSPITAL": "nLhbC6Mf8qCQRUXf7oRpoS"`

- Attempt to match a hopital name
- Add hospital code mapping to facility.json

#### Attempt to map to seeded locations (local.json)
Destination format: `Record<name: string, Pcode: string>`
e.g. `"ARORANGI,RAROTONGA": "COK-001-005"`

- Always favour the highest level location, but no higher than what is matched
    - e.g. "Rarotonga Avarua" - Rarotonga is level 1, Avarua is level 2 therefore is a higher level so take its Pcode: "COK-001-001"
    - e.g "Rarotonga, cook islands" - Rarotoga is level 1 so only map to level 1, Pcode: "COK-001"
- Add location Pcode mapping to local.json

#### Attempt to map to international location (intl.json)
Destination format: `Record<name: string, Records<country: string, town: string>>`
e.g.
```
{
    "10 DILLON CRES WIRI AUCKLAND NEW ZEALAND": {
        "country": "NZL",
        "town": "10 DILLON CRES WIRI AUCKLAND"
    }
}
```

- Attempt to match a country by name
- Save the country code to the `country` property
- Add remaining text to the `town` property
- Add mapping to intl.json

#### Add remaining to garbage
- If prior attempts fail to match, add to garbage.json