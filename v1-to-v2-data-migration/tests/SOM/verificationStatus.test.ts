import { transform } from '../../helpers/transform.ts'
import { assertEquals } from 'https://deno.land/std@0.210.0/assert/mod.ts'
import {
  buildBirthResolver,
  buildBirthEventRegistration,
  buildDeathResolver,
  buildDeathEventRegistration,
} from '../utils/testHelpers.ts'

// Construct resolvers as in migrate.ipynb
const birthResolver = buildBirthResolver()
const deathResolver = buildDeathResolver()

Deno.test('SOM verification status tests - birth events', async (t) => {
  await t.step('should map "authenticated" status for mother', () => {
    const registration = buildBirthEventRegistration({
      questionnaire: [
        {
          fieldId: 'birth.mother.mother-view-group.verified',
          value: 'authenticated',
        },
      ],
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.verified'], 'authenticated')
  })

  await t.step('should map "verified" status for father', () => {
    const registration = buildBirthEventRegistration({
      questionnaire: [
        {
          fieldId: 'birth.father.father-view-group.verified',
          value: 'verified',
        },
      ],
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['father.verified'], 'verified')
  })

  await t.step('should map "failed" status for informant', () => {
    const registration = buildBirthEventRegistration({
      questionnaire: [
        {
          fieldId: 'birth.informant.informant-view-group.verified',
          value: 'failed',
        },
      ],
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.verified'], 'failed')
  })

  await t.step('should map "pending" status', () => {
    const registration = buildBirthEventRegistration({
      questionnaire: [
        {
          fieldId: 'birth.mother.mother-view-group.verified',
          value: 'pending',
        },
      ],
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.verified'], 'pending')
  })

  await t.step('should map "failedFetchIdDetails" to "failed"', () => {
    const registration = buildBirthEventRegistration({
      questionnaire: [
        {
          fieldId: 'birth.mother.mother-view-group.verified',
          value: 'failedFetchIdDetails',
        },
      ],
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.verified'], 'failed')
  })

  await t.step('should handle undefined verification status', () => {
    const registration = buildBirthEventRegistration({
      questionnaire: [],
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.verified'], undefined)
  })

  await t.step('should handle multiple verification fields', () => {
    const registration = buildBirthEventRegistration({
      questionnaire: [
        {
          fieldId: 'birth.mother.mother-view-group.verified',
          value: 'verified',
        },
        {
          fieldId: 'birth.father.father-view-group.verified',
          value: 'authenticated',
        },
        {
          fieldId: 'birth.informant.informant-view-group.verified',
          value: 'pending',
        },
      ],
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.verified'], 'verified')
    assertEquals(declareAction?.declaration['father.verified'], 'authenticated')
    assertEquals(declareAction?.declaration['informant.verified'], 'pending')
  })
})

Deno.test('SOM verification status tests - death events', async (t) => {
  await t.step('should map "authenticated" status for deceased', () => {
    const registration = buildDeathEventRegistration({
      questionnaire: [
        {
          fieldId: 'death.deceased.deceased-view-group.verified',
          value: 'authenticated',
        },
      ],
    })

    const result = transform(registration, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['deceased.verified'],
      'authenticated'
    )
  })

  await t.step('should map "verified" status for informant', () => {
    const registration = buildDeathEventRegistration({
      questionnaire: [
        {
          fieldId: 'death.informant.informant-view-group.verified',
          value: 'verified',
        },
      ],
    })

    const result = transform(registration, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.verified'], 'verified')
  })

  await t.step('should map "failed" status for spouse', () => {
    const registration = buildDeathEventRegistration({
      questionnaire: [
        {
          fieldId: 'death.spouse.spouse-view-group.verified',
          value: 'failed',
        },
      ],
    })

    const result = transform(registration, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.verified'], 'failed')
  })

  await t.step('should map "pending" status', () => {
    const registration = buildDeathEventRegistration({
      questionnaire: [
        {
          fieldId: 'death.deceased.deceased-view-group.verified',
          value: 'pending',
        },
      ],
    })

    const result = transform(registration, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.verified'], 'pending')
  })

  await t.step(
    'should map "failedFetchIdDetails" to "failed" for deceased',
    () => {
      const registration = buildDeathEventRegistration({
        questionnaire: [
          {
            fieldId: 'death.deceased.deceased-view-group.verified',
            value: 'failedFetchIdDetails',
          },
        ],
      })

      const result = transform(registration, deathResolver, 'death')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(declareAction?.declaration['deceased.verified'], 'failed')
    }
  )

  await t.step('should handle undefined verification status', () => {
    const registration = buildDeathEventRegistration({
      questionnaire: [],
    })

    const result = transform(registration, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.verified'], undefined)
  })

  await t.step('should handle multiple verification fields', () => {
    const registration = buildDeathEventRegistration({
      questionnaire: [
        {
          fieldId: 'death.deceased.deceased-view-group.verified',
          value: 'verified',
        },
        {
          fieldId: 'death.informant.informant-view-group.verified',
          value: 'authenticated',
        },
        {
          fieldId: 'death.spouse.spouse-view-group.verified',
          value: 'pending',
        },
      ],
    })

    const result = transform(registration, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.verified'], 'verified')
    assertEquals(
      declareAction?.declaration['informant.verified'],
      'authenticated'
    )
    assertEquals(declareAction?.declaration['spouse.verified'], 'pending')
  })
})
