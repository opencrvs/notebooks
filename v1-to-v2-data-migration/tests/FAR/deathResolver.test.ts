import { assertEquals } from 'jsr:@std/assert'
import { transform } from '../../helpers/transform.ts'
import {
  buildDeathResolver,
  buildDeathEventRegistration,
} from '../utils/testHelpers.ts'
import { COUNTRY_CODE } from '../../countryData/addressResolver.ts'

const deathResolver = buildDeathResolver()

Deno.test('deathResolver - spouse fields', async (t) => {
  await t.step('should resolve spouse.detailsNotAvailable when false', () => {
    const data = buildDeathEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['spouse.detailsNotAvailable'],
      false
    )
  })

  await t.step('should resolve spouse.detailsNotAvailable when true', () => {
    const data = buildDeathEventRegistration({
      spouse: {
        ...buildDeathEventRegistration().spouse!,
        detailsExist: false,
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.detailsNotAvailable'], true)
  })

  await t.step('should resolve spouse.reason', () => {
    const data = buildDeathEventRegistration({
      spouse: {
        ...buildDeathEventRegistration().spouse!,
        reasonNotApplying: 'Divorced',
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.reason'], 'Divorced')
  })

  await t.step('should resolve spouse.name', () => {
    const data = buildDeathEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.name'], {
      firstname: 'Mary',
      middleName: undefined,
      surname: 'Smith',
    })
  })

  await t.step('should resolve spouse.dob', () => {
    const data = buildDeathEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.dob'], '1952-01-01')
  })

  await t.step('should resolve spouse.dobUnknown', () => {
    const data = buildDeathEventRegistration({
      spouse: {
        ...buildDeathEventRegistration().spouse!,
        exactDateOfBirthUnknown: true,
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.dobUnknown'], true)
  })

  await t.step('should resolve spouse.age', () => {
    const data = buildDeathEventRegistration({
      spouse: {
        ...buildDeathEventRegistration().spouse!,
        ageOfIndividualInYears: 72,
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.age'], {
      age: 72,
      asOfDateRef: 'eventDetails.date',
    })
  })

  await t.step('should resolve spouse.nationality', () => {
    const data = buildDeathEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.nationality'], COUNTRY_CODE)
  })

  await t.step('should resolve spouse.idType from questionnaire', () => {
    const data = buildDeathEventRegistration({
      questionnaire: [
        {
          fieldId: 'death.spouse.spouse-view-group.spouseIdType',
          value: 'NATIONAL_ID',
        },
      ],
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.idType'], 'NATIONAL_ID')
  })

  await t.step('should resolve spouse.nid', () => {
    const data = buildDeathEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.nid'], 'SPO456')
  })

  await t.step('should resolve spouse.passport', () => {
    const data = buildDeathEventRegistration({
      spouse: {
        ...buildDeathEventRegistration().spouse!,
        identifier: [{ type: 'PASSPORT', id: 'P456' }],
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.passport'], 'P456')
  })

  await t.step('should resolve spouse.brn', () => {
    const data = buildDeathEventRegistration({
      spouse: {
        ...buildDeathEventRegistration().spouse!,
        identifier: [{ type: 'BIRTH_REGISTRATION_NUMBER', id: 'B456' }],
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.brn'], 'B456')
  })

  await t.step('should resolve spouse.verified from questionnaire', () => {
    const data = buildDeathEventRegistration({
      questionnaire: [
        {
          fieldId: 'death.spouse.spouse-view-group.verified',
          value: 'verified',
        },
      ],
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.verified'], 'verified')
  })
})

Deno.test('deathResolver - informant fields', async (t) => {
  await t.step('should not resolve informant.dob for SPOUSE', () => {
    const data = buildDeathEventRegistration({
      informant: {
        ...buildDeathEventRegistration().informant!,
        relationship: 'SPOUSE',
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.dob'], undefined)
  })

  await t.step('should not resolve informant.name for SPOUSE', () => {
    const registration = buildDeathEventRegistration({
      informant: {
        relationship: 'SPOUSE',
        name: [
          {
            firstNames: 'Amina',
            familyName: 'Omar',
          },
        ],
      },
    })

    const result = transform(registration, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    // SPOUSE is a special informant, so informant.name should not be set
    assertEquals(declareAction?.declaration['informant.name'], undefined)
  })
})
