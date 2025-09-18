import { expect } from 'jsr:@std/expect'
import { transformCorrection } from '../helpers/transform.ts'
import { assertEquals } from 'https://deno.land/std@0.210.0/assert/mod.ts'

Deno.test('transformCorrection', async (t) => {
  await t.step('should transform scalar values', () => {
    const historyItem = {
      output: [
        {
          valueCode: 'informant',
          valueId: 'registrationPhone',
          value: '0788787290',
          __typename: 'InputOutput',
        },
        {
          valueCode: 'mother',
          valueId: 'nationality',
          value: 'JPN',
          __typename: 'InputOutput',
        },
      ],
    }

    const event = 'birth' as const

    const result = transformCorrection(historyItem, event, {})

    const expected = {
      'informant.phoneNo': '0788787290',
      'mother.nationality': 'JPN',
    }
    assertEquals(result, expected)
  })

  await t.step('should transform custom fields', () => {
    const historyItem = {
      output: [
        {
          valueCode: 'informant',
          valueId: 'informantIdType',
          value: 'NATIONAL_ID',
        },
        {
          valueCode: 'informant',
          valueId: 'informantNationalId',
          value: '0011002211',
        },
        {
          valueCode: 'informant',
          valueId: 'registrationPhone',
          value: '0715773955',
        },
      ],
    }

    const event = 'birth' as const

    const result = transformCorrection(historyItem, event, {})

    const expected = {
      'informant.idType': 'NATIONAL_ID',
      'informant.nid': '0011002211',
      'informant.phoneNo': '0715773955',
    }
    assertEquals(result, expected)
  })

  await t.step('should transform name values', () => {
    const historyItem = {
      output: [
        {
          valueCode: 'child',
          valueId: 'firstNamesEng',
          value: 'Tarzan',
          __typename: 'InputOutput',
        },
        {
          valueCode: 'mother',
          valueId: 'familyNameEng',
          value: 'Susan',
          __typename: 'InputOutput',
        },
      ],
    }

    const event = 'birth' as const

    const result = transformCorrection(historyItem, event, {})

    const expected = {
      'child.name': { firstname: 'Tarzan' },
      'mother.name': { surname: 'Susan' },
    }
    assertEquals(result, expected)
  })

  await t.step('should transform address values', () => {
    const historyItem = {
      output: [
        {
          valueCode: 'mother',
          valueId: 'internationalStatePrimaryMother',
          value: 'SSSTSSTTT',
        },
        {
          valueCode: 'mother',
          valueId: 'internationalDistrictPrimaryMother',
          value: 'DDDDDDDD',
        },
        {
          valueCode: 'mother',
          valueId: 'internationalCityPrimaryMother',
          value: 'CCCCCCCCC',
        },
        {
          valueCode: 'mother',
          valueId: 'internationalAddressLine1PrimaryMother',
          value: '111',
        },
        {
          valueCode: 'mother',
          valueId: 'internationalAddressLine2PrimaryMother',
          value: '2222',
        },
        {
          valueCode: 'mother',
          valueId: 'internationalAddressLine3PrimaryMother',
          value: '3333',
        },
        {
          valueCode: 'mother',
          valueId: 'internationalPostalCodePrimaryMother',
          value: '400111',
        },
      ],
    }

    const declaration = {
      'mother.address': {
        addressType: 'INTERNATIONAL',
        country: 'KEN',
      },
    }

    const event = 'birth' as const

    const result = transformCorrection(historyItem, event, declaration)

    const expected = {
      'mother.address': {
        addressType: 'INTERNATIONAL',
        country: 'KEN',
        streetLevelDetails: {
          state: 'SSSTSSTTT',
          district2: 'DDDDDDDD',
          cityOrTown: 'CCCCCCCCC',
          addressLine1: '111',
          addressLine2: '2222',
          addressLine3: '3333',
          postcodeOrZip: '400111',
        },
      },
    }

    assertEquals(result, expected)
  })
})
