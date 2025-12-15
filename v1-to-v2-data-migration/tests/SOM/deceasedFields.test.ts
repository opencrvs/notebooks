import { transform } from '../../helpers/transform.ts'
import { assertEquals } from 'https://deno.land/std@0.210.0/assert/mod.ts'
import {
  buildDeathResolver,
  buildDeathEventRegistration,
} from '../utils/testHelpers.ts'

// Construct resolver as in migrate.ipynb
const deathResolver = buildDeathResolver()

Deno.test('SOM deceased fields tests', async (t) => {
  await t.step(
    'should resolve deceased.placeOfBirth from questionnaire',
    () => {
      const registration = buildDeathEventRegistration({
        questionnaire: [
          {
            fieldId: 'death.deceased.deceased-view-group.placeOfBirth',
            value: 'Mogadishu, Somalia',
          },
        ],
      })

      const result = transform(registration, deathResolver, 'death')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(
        declareAction?.declaration['deceased.placeOfBirth'],
        'Mogadishu, Somalia'
      )
    }
  )

  await t.step('should resolve deceased.occupation from questionnaire', () => {
    const registration = buildDeathEventRegistration({
      questionnaire: [
        {
          fieldId: 'death.deceased.deceased-view-group.occupation',
          value: 'Teacher',
        },
      ],
    })

    const result = transform(registration, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.occupation'], 'Teacher')
  })

  await t.step('should resolve deceased.brn from questionnaire', () => {
    const registration = buildDeathEventRegistration({
      questionnaire: [
        {
          fieldId: 'death.deceased.deceased-view-group.birthRegNo',
          value: 'B2020123456',
        },
      ],
    })

    const result = transform(registration, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.brn'], 'B2020123456')
  })

  await t.step(
    'should resolve eventDetails.timeOfDeath from questionnaire',
    () => {
      const registration = buildDeathEventRegistration({
        questionnaire: [
          {
            fieldId: 'death.deathEvent.death-event-details.timeOfDeath',
            value: '14:30',
          },
        ],
      })

      const result = transform(registration, deathResolver, 'death')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(
        declareAction?.declaration['eventDetails.timeOfDeath'],
        '14:30'
      )
    }
  )

  await t.step('should resolve informant.relation from relationship', () => {
    const registration = buildDeathEventRegistration({
      informant: {
        relationship: 'SON',
      },
    })

    const result = transform(registration, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.relation'], 'SON')
  })

  await t.step(
    'should resolve eventDetails.date from deceased.deathDate',
    () => {
      const registration = buildDeathEventRegistration({
        deceased: {
          deceased: {
            deathDate: '2023-12-15',
          },
        },
      })

      const result = transform(registration, deathResolver, 'death')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(
        declareAction?.declaration['eventDetails.date'],
        '2023-12-15'
      )
    }
  )

  await t.step('should handle missing deceased.placeOfBirth gracefully', () => {
    const registration = buildDeathEventRegistration({
      questionnaire: [],
    })

    const result = transform(registration, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.placeOfBirth'], undefined)
  })

  await t.step('should handle missing deceased.occupation gracefully', () => {
    const registration = buildDeathEventRegistration({
      questionnaire: [],
    })

    const result = transform(registration, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.occupation'], undefined)
  })

  await t.step('should handle missing deceased.brn gracefully', () => {
    const registration = buildDeathEventRegistration({
      questionnaire: [],
    })

    const result = transform(registration, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.brn'], undefined)
  })

  await t.step(
    'should handle missing eventDetails.timeOfDeath gracefully',
    () => {
      const registration = buildDeathEventRegistration({
        questionnaire: [],
      })

      const result = transform(registration, deathResolver, 'death')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(
        declareAction?.declaration['eventDetails.timeOfDeath'],
        undefined
      )
    }
  )
})
