import { transform } from '../../helpers/transform.ts'
import {
  buildBirthResolver,
  buildBirthEventRegistration,
  buildDeathEventRegistration,
  buildDeathResolver,
} from '../utils/testHelpers.ts'
import { assertEquals } from 'https://deno.land/std@0.210.0/assert/mod.ts'
import type { Action } from '../../helpers/types.ts'

Deno.test('PostProcess - Single Correction', async (t) => {
  const birthResolver = buildBirthResolver()

  await t.step(
    'should update previous action declaration with correction input for single correction',
    () => {
      const registration = buildBirthEventRegistration({
        history: [
          {
            date: '2024-01-01T10:00:00Z',
            regStatus: 'DECLARED',
            user: { id: 'user1', role: { id: 'FIELD_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-02T12:00:00Z',
            regStatus: 'REGISTERED',
            user: { id: 'user2', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-03T14:00:00Z',
            action: 'REQUESTED_CORRECTION',
            user: { id: 'user3', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
            input: [
              {
                valueCode: 'child',
                valueId: 'gender',
                value: 'male',
              },
              {
                valueCode: 'informant',
                valueId: 'registrationPhone',
                value: '0788888888',
              },
            ],
            output: [
              {
                valueCode: 'child',
                valueId: 'gender',
                value: 'female',
              },
              {
                valueCode: 'informant',
                valueId: 'registrationPhone',
                value: '0799999999',
              },
            ],
          },
        ],
      })

      const result = transform(registration, birthResolver, 'birth')

      // Find the actions
      const registerAction = result.actions.find(
        (a) => a.type === 'REGISTER'
      ) as Action
      const correctionAction = result.actions.find(
        (a) => a.type === 'REQUEST_CORRECTION'
      ) as Action

      // The correction action should have the new values in declaration
      assertEquals(correctionAction?.declaration?.['child.gender'], 'female')
      assertEquals(
        correctionAction?.declaration?.['informant.phoneNo'],
        '0799999999'
      )

      // The correction action should have the old values in annotation
      assertEquals(correctionAction?.annotation?.['child.gender'], 'male')
      assertEquals(
        correctionAction?.annotation?.['informant.phoneNo'],
        '0788888888'
      )

      // The REGISTER action (previous action with declaration) should now have the old values
      assertEquals(registerAction?.declaration?.['child.gender'], 'male')
      assertEquals(
        registerAction?.declaration?.['informant.phoneNo'],
        '0788888888'
      )
    }
  )

  await t.step(
    'should handle correction when previous action is DECLARE instead of REGISTER',
    () => {
      const registration = buildBirthEventRegistration({
        history: [
          {
            date: '2024-01-01T10:00:00Z',
            regStatus: 'DECLARED',
            user: { id: 'user1', role: { id: 'FIELD_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-02T14:00:00Z',
            action: 'REQUESTED_CORRECTION',
            user: { id: 'user2', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
            input: [
              {
                valueCode: 'mother',
                valueId: 'nationality',
                value: 'USA',
              },
            ],
            output: [
              {
                valueCode: 'mother',
                valueId: 'nationality',
                value: 'GBR',
              },
            ],
          },
        ],
      })

      const result = transform(registration, birthResolver, 'birth')

      const declareAction = result.actions.find(
        (a) => a.type === 'DECLARE'
      ) as Action
      const correctionAction = result.actions.find(
        (a) => a.type === 'REQUEST_CORRECTION'
      ) as Action

      // Correction has new value
      assertEquals(correctionAction?.declaration?.['mother.nationality'], 'GBR')
      assertEquals(correctionAction?.annotation?.['mother.nationality'], 'USA')

      // DECLARE action should now have old value
      assertEquals(declareAction?.declaration?.['mother.nationality'], 'USA')
    }
  )

  await t.step(
    'should handle correction with complex nested fields (names)',
    () => {
      const registration = buildBirthEventRegistration({
        history: [
          {
            date: '2024-01-01T10:00:00Z',
            regStatus: 'DECLARED',
            user: { id: 'user1', role: { id: 'FIELD_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-02T12:00:00Z',
            regStatus: 'REGISTERED',
            user: { id: 'user2', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-03T14:00:00Z',
            action: 'REQUESTED_CORRECTION',
            user: { id: 'user3', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
            input: [
              {
                valueCode: 'child',
                valueId: 'firstNamesEng',
                value: 'OldFirstName',
              },
              {
                valueCode: 'child',
                valueId: 'familyNameEng',
                value: 'OldLastName',
              },
            ],
            output: [
              {
                valueCode: 'child',
                valueId: 'firstNamesEng',
                value: 'NewFirstName',
              },
              {
                valueCode: 'child',
                valueId: 'familyNameEng',
                value: 'NewLastName',
              },
            ],
          },
        ],
      })

      const result = transform(registration, birthResolver, 'birth')

      const registerAction = result.actions.find(
        (a) => a.type === 'REGISTER'
      ) as Action
      const correctionAction = result.actions.find(
        (a) => a.type === 'REQUEST_CORRECTION'
      ) as Action

      // Correction has new name
      assertEquals(correctionAction?.declaration?.['child.name'], {
        firstname: 'NewFirstName',
        surname: 'NewLastName',
      })
      assertEquals(correctionAction?.annotation?.['child.name'], {
        firstname: 'OldFirstName',
        surname: 'OldLastName',
      })

      // REGISTER action should now have old name
      assertEquals(registerAction?.declaration?.['child.name'], {
        firstname: 'OldFirstName',
        surname: 'OldLastName',
      })
    }
  )
})

Deno.test('PostProcess - Multiple Corrections', async (t) => {
  const birthResolver = buildBirthResolver()

  await t.step(
    'should handle multiple sequential corrections correctly',
    () => {
      const registration = buildBirthEventRegistration({
        history: [
          {
            date: '2024-01-01T10:00:00Z',
            regStatus: 'DECLARED',
            user: { id: 'user1', role: { id: 'FIELD_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-02T12:00:00Z',
            regStatus: 'REGISTERED',
            user: { id: 'user2', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-03T14:00:00Z',
            action: 'REQUESTED_CORRECTION',
            user: { id: 'user3', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
            input: [
              {
                valueCode: 'child',
                valueId: 'gender',
                value: 'male',
              },
            ],
            output: [
              {
                valueCode: 'child',
                valueId: 'gender',
                value: 'female',
              },
            ],
          },
          {
            date: '2024-01-04T16:00:00Z',
            action: 'REQUESTED_CORRECTION',
            user: { id: 'user4', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
            input: [
              {
                valueCode: 'child',
                valueId: 'gender',
                value: 'female',
              },
              {
                valueCode: 'mother',
                valueId: 'nationality',
                value: 'USA',
              },
            ],
            output: [
              {
                valueCode: 'child',
                valueId: 'gender',
                value: 'male',
              },
              {
                valueCode: 'mother',
                valueId: 'nationality',
                value: 'GBR',
              },
            ],
          },
        ],
      })

      const result = transform(registration, birthResolver, 'birth')

      // Find all actions
      const registerAction = result.actions.find(
        (a) => a.type === 'REGISTER'
      ) as Action
      const corrections = result.actions.filter(
        (a) => a.type === 'REQUEST_CORRECTION'
      ) as Action[]

      assertEquals(corrections.length, 2, 'Should have 2 correction actions')

      const firstCorrection = corrections[0]
      const secondCorrection = corrections[1]

      // First correction: male → female
      assertEquals(firstCorrection?.declaration?.['child.gender'], 'female')
      assertEquals(firstCorrection?.annotation?.['child.gender'], 'male')

      // Second correction: female → male, USA → GBR
      assertEquals(secondCorrection?.declaration?.['child.gender'], 'male')
      assertEquals(secondCorrection?.declaration?.['mother.nationality'], 'GBR')
      assertEquals(secondCorrection?.annotation?.['child.gender'], 'female')
      assertEquals(secondCorrection?.annotation?.['mother.nationality'], 'USA')

      // REGISTER action should have the ORIGINAL value (male) from before first correction
      assertEquals(registerAction?.declaration?.['child.gender'], 'male')

      // The first correction should now show the state after register (male) was changed
      // So first correction declaration should still show female, and annotation should show male
      // But this is already tested above

      // The second correction should reference the first correction's output as its input
      // This is already captured in the secondCorrection checks above
    }
  )

  await t.step(
    'should handle corrections of different fields across multiple corrections',
    () => {
      const registration = buildBirthEventRegistration({
        history: [
          {
            date: '2024-01-01T10:00:00Z',
            regStatus: 'DECLARED',
            user: { id: 'user1', role: { id: 'FIELD_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-02T12:00:00Z',
            regStatus: 'REGISTERED',
            user: { id: 'user2', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-03T14:00:00Z',
            action: 'REQUESTED_CORRECTION',
            user: { id: 'user3', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
            input: [
              {
                valueCode: 'child',
                valueId: 'gender',
                value: 'male',
              },
            ],
            output: [
              {
                valueCode: 'child',
                valueId: 'gender',
                value: 'female',
              },
            ],
          },
          {
            date: '2024-01-04T16:00:00Z',
            action: 'REQUESTED_CORRECTION',
            user: { id: 'user4', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
            input: [
              {
                valueCode: 'mother',
                valueId: 'nationality',
                value: 'USA',
              },
            ],
            output: [
              {
                valueCode: 'mother',
                valueId: 'nationality',
                value: 'GBR',
              },
            ],
          },
        ],
      })

      const result = transform(registration, birthResolver, 'birth')

      const registerAction = result.actions.find(
        (a) => a.type === 'REGISTER'
      ) as Action
      const corrections = result.actions.filter(
        (a) => a.type === 'REQUEST_CORRECTION'
      ) as Action[]

      assertEquals(corrections.length, 2)

      // First correction (child.gender)
      assertEquals(corrections[0]?.declaration?.['child.gender'], 'female')
      assertEquals(corrections[0]?.annotation?.['child.gender'], 'male')

      // Second correction (mother.nationality) - different field
      assertEquals(corrections[1]?.declaration?.['mother.nationality'], 'GBR')
      assertEquals(corrections[1]?.annotation?.['mother.nationality'], 'USA')

      // REGISTER should have BOTH original values
      assertEquals(registerAction?.declaration?.['child.gender'], 'male')
      assertEquals(registerAction?.declaration?.['mother.nationality'], 'USA')
    }
  )
})

Deno.test('PostProcess - Corrections With Actions In Between', async (t) => {
  const birthResolver = buildBirthResolver()

  await t.step(
    'should handle correction with other actions before it (skip empty declarations)',
    () => {
      const registration = buildBirthEventRegistration({
        history: [
          {
            date: '2024-01-01T10:00:00Z',
            regStatus: 'DECLARED',
            user: { id: 'user1', role: { id: 'FIELD_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-02T12:00:00Z',
            regStatus: 'REGISTERED',
            user: { id: 'user2', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-03T13:00:00Z',
            action: 'ASSIGNED',
            user: { id: 'user3', role: { id: 'FIELD_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-04T14:00:00Z',
            action: 'VIEWED',
            user: { id: 'user4', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-05T15:00:00Z',
            action: 'REQUESTED_CORRECTION',
            user: { id: 'user5', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
            input: [
              {
                valueCode: 'child',
                valueId: 'gender',
                value: 'male',
              },
            ],
            output: [
              {
                valueCode: 'child',
                valueId: 'gender',
                value: 'female',
              },
            ],
          },
        ],
      })

      const result = transform(registration, birthResolver, 'birth')

      const registerAction = result.actions.find(
        (a) => a.type === 'REGISTER'
      ) as Action
      const assignAction = result.actions.find(
        (a) => a.type === 'ASSIGN'
      ) as Action
      const readAction = result.actions.find((a) => a.type === 'READ') as Action
      const correctionAction = result.actions.find(
        (a) => a.type === 'REQUEST_CORRECTION'
      ) as Action

      // Correction has new value
      assertEquals(correctionAction?.declaration?.['child.gender'], 'female')
      assertEquals(correctionAction?.annotation?.['child.gender'], 'male')

      // ASSIGN and READ actions should have empty declarations
      assertEquals(Object.keys(assignAction?.declaration || {}).length, 0)
      assertEquals(Object.keys(readAction?.declaration || {}).length, 0)

      // REGISTER action should have the old value (skipping empty declaration actions)
      assertEquals(registerAction?.declaration?.['child.gender'], 'male')
    }
  )

  await t.step(
    'should reverse engineer through multiple corrections with actions in between',
    () => {
      const registration = buildBirthEventRegistration({
        history: [
          {
            date: '2024-01-01T10:00:00Z',
            regStatus: 'DECLARED',
            user: { id: 'user1', role: { id: 'FIELD_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-02T12:00:00Z',
            regStatus: 'REGISTERED',
            user: { id: 'user2', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-03T14:00:00Z',
            action: 'REQUESTED_CORRECTION',
            user: { id: 'user3', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
            input: [
              {
                valueCode: 'child',
                valueId: 'gender',
                value: 'male',
              },
            ],
            output: [
              {
                valueCode: 'child',
                valueId: 'gender',
                value: 'female',
              },
            ],
          },
          {
            date: '2024-01-04T15:00:00Z',
            action: 'VIEWED',
            user: { id: 'user4', role: { id: 'FIELD_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-05T16:00:00Z',
            action: 'ASSIGNED',
            user: { id: 'user5', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-06T17:00:00Z',
            action: 'REQUESTED_CORRECTION',
            user: { id: 'user6', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
            input: [
              {
                valueCode: 'child',
                valueId: 'gender',
                value: 'female',
              },
              {
                valueCode: 'mother',
                valueId: 'nationality',
                value: 'USA',
              },
            ],
            output: [
              {
                valueCode: 'child',
                valueId: 'gender',
                value: 'male',
              },
              {
                valueCode: 'mother',
                valueId: 'nationality',
                value: 'GBR',
              },
            ],
          },
        ],
      })

      const result = transform(registration, birthResolver, 'birth')

      const registerAction = result.actions.find(
        (a) => a.type === 'REGISTER'
      ) as Action
      const corrections = result.actions.filter(
        (a) => a.type === 'REQUEST_CORRECTION'
      ) as Action[]

      assertEquals(corrections.length, 2)

      // First correction: male → female
      assertEquals(corrections[0]?.declaration?.['child.gender'], 'female')
      assertEquals(corrections[0]?.annotation?.['child.gender'], 'male')

      // Second correction: female → male, USA → GBR
      assertEquals(corrections[1]?.declaration?.['child.gender'], 'male')
      assertEquals(corrections[1]?.declaration?.['mother.nationality'], 'GBR')
      assertEquals(corrections[1]?.annotation?.['child.gender'], 'female')
      assertEquals(corrections[1]?.annotation?.['mother.nationality'], 'USA')

      // The first correction should be reverse-engineered to show the state before it
      // which should trace back to REGISTER (skipping VIEWED and ASSIGNED)
      // So first correction should update the REGISTER action to show original male
      assertEquals(registerAction?.declaration?.['child.gender'], 'male')

      // The REGISTER should also have the original mother.nationality
      assertEquals(registerAction?.declaration?.['mother.nationality'], 'USA')

      // The second correction should update the first correction's declaration
      // to show the state that existed before second correction (which is after first)
      // First correction's declaration already shows female, which is correct
      // Second correction's annotation shows female, which references first correction's output
    }
  )

  await t.step(
    'should handle validation action between register and correction',
    () => {
      const registration = buildBirthEventRegistration({
        history: [
          {
            date: '2024-01-01T10:00:00Z',
            regStatus: 'DECLARED',
            user: { id: 'user1', role: { id: 'FIELD_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-02T12:00:00Z',
            regStatus: 'REGISTERED',
            user: { id: 'user2', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-03T13:00:00Z',
            regStatus: 'VALIDATED',
            user: { id: 'user3', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-04T14:00:00Z',
            action: 'REQUESTED_CORRECTION',
            user: { id: 'user4', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
            input: [
              {
                valueCode: 'informant',
                valueId: 'registrationPhone',
                value: '0788888888',
              },
            ],
            output: [
              {
                valueCode: 'informant',
                valueId: 'registrationPhone',
                value: '0799999999',
              },
            ],
          },
        ],
      })

      const result = transform(registration, birthResolver, 'birth')

      const validateAction = result.actions.find(
        (a) => a.type === 'VALIDATE'
      ) as Action
      const correctionAction = result.actions.find(
        (a) => a.type === 'REQUEST_CORRECTION'
      ) as Action

      // Correction has new phone
      assertEquals(
        correctionAction?.declaration?.['informant.phoneNo'],
        '0799999999'
      )
      assertEquals(
        correctionAction?.annotation?.['informant.phoneNo'],
        '0788888888'
      )

      // VALIDATE action (most recent before correction with non-empty declaration)
      // should have the old phone number
      assertEquals(
        validateAction?.declaration?.['informant.phoneNo'],
        '0788888888'
      )
    }
  )
})

Deno.test('PostProcess - Death Event Corrections', async (t) => {
  const deathResolver = buildDeathResolver()

  await t.step('should handle single correction for death event', () => {
    const registration = buildDeathEventRegistration({
      history: [
        {
          date: '2024-01-01T10:00:00Z',
          regStatus: 'DECLARED',
          user: { id: 'user1', role: { id: 'FIELD_AGENT' } },
          office: { id: 'office1' },
        },
        {
          date: '2024-01-02T12:00:00Z',
          regStatus: 'REGISTERED',
          user: { id: 'user2', role: { id: 'REGISTRATION_AGENT' } },
          office: { id: 'office1' },
        },
        {
          date: '2024-01-03T14:00:00Z',
          action: 'REQUESTED_CORRECTION',
          user: { id: 'user3', role: { id: 'REGISTRATION_AGENT' } },
          office: { id: 'office1' },
          input: [
            {
              valueCode: 'deceased',
              valueId: 'gender',
              value: 'male',
            },
          ],
          output: [
            {
              valueCode: 'deceased',
              valueId: 'gender',
              value: 'female',
            },
          ],
        },
      ],
    })

    const result = transform(registration, deathResolver, 'death')

    const registerAction = result.actions.find(
      (a) => a.type === 'REGISTER'
    ) as Action
    const correctionAction = result.actions.find(
      (a) => a.type === 'REQUEST_CORRECTION'
    ) as Action

    // Correction has new value
    assertEquals(correctionAction?.declaration?.['deceased.gender'], 'female')
    assertEquals(correctionAction?.annotation?.['deceased.gender'], 'male')

    // REGISTER action should have old value
    assertEquals(registerAction?.declaration?.['deceased.gender'], 'male')
  })

  await t.step(
    'should handle multiple corrections for death event with different fields',
    () => {
      const registration = buildDeathEventRegistration({
        deceased: {
          nationality: ['USA'],
        },
        mannerOfDeath: 'NATURAL_CAUSES',
        history: [
          {
            date: '2024-01-01T10:00:00Z',
            regStatus: 'DECLARED',
            user: { id: 'user1', role: { id: 'FIELD_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-02T12:00:00Z',
            regStatus: 'REGISTERED',
            user: { id: 'user2', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-03T14:00:00Z',
            action: 'REQUESTED_CORRECTION',
            user: { id: 'user3', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
            input: [
              {
                valueCode: 'deceased',
                valueId: 'nationality',
                value: 'USA',
              },
            ],
            output: [
              {
                valueCode: 'deceased',
                valueId: 'nationality',
                value: 'GBR',
              },
            ],
          },
          {
            date: '2024-01-04T16:00:00Z',
            action: 'REQUESTED_CORRECTION',
            user: { id: 'user4', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
            input: [
              {
                valueCode: 'deathEvent',
                valueId: 'mannerOfDeath',
                value: 'NATURAL_CAUSES',
              },
            ],
            output: [
              {
                valueCode: 'deathEvent',
                valueId: 'mannerOfDeath',
                value: 'ACCIDENT',
              },
            ],
          },
        ],
      })

      const result = transform(registration, deathResolver, 'death')

      const registerAction = result.actions.find(
        (a) => a.type === 'REGISTER'
      ) as Action
      const corrections = result.actions.filter(
        (a) => a.type === 'REQUEST_CORRECTION'
      ) as Action[]

      assertEquals(corrections.length, 2)

      // First correction
      assertEquals(corrections[0]?.declaration?.['deceased.nationality'], 'GBR')
      assertEquals(corrections[0]?.annotation?.['deceased.nationality'], 'USA')

      // Second correction
      assertEquals(
        corrections[1]?.declaration?.['eventDetails.mannerOfDeath'],
        'ACCIDENT'
      )
      assertEquals(
        corrections[1]?.annotation?.['eventDetails.mannerOfDeath'],
        'NATURAL_CAUSES'
      )

      // REGISTER should have both original values
      assertEquals(registerAction?.declaration?.['deceased.nationality'], 'USA')
      assertEquals(
        registerAction?.declaration?.['eventDetails.mannerOfDeath'],
        'NATURAL_CAUSES'
      )
    }
  )
})

Deno.test('PostProcess - Multiple Corrections', async (t) => {
  const birthResolver = buildBirthResolver()

  await t.step(
    'should set annotation to previous declaration and reverse enngineer the original declaration',
    () => {
      const registration = buildBirthEventRegistration({
        child: {
          gender: 'female',
        },
        mother: {
          nationality: ['GBR'],
        },
        history: [
          {
            date: '2024-01-01T10:00:00Z',
            regStatus: 'DECLARED',
            user: { id: 'user1', role: { id: 'FIELD_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-02T12:00:00Z',
            regStatus: 'REGISTERED',
            user: { id: 'user2', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
          },
          {
            date: '2024-01-03T14:00:00Z',
            action: 'REQUESTED_CORRECTION',
            user: { id: 'user3', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
            input: [
              {
                valueCode: 'child',
                valueId: 'gender',
                value: 'male',
              },
            ],
            output: [
              {
                valueCode: 'child',
                valueId: 'gender',
                value: 'female',
              },
            ],
          },
          {
            date: '2024-01-04T16:00:00Z',
            action: 'REQUESTED_CORRECTION',
            user: { id: 'user4', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
            input: [
              {
                valueCode: 'mother',
                valueId: 'nationality',
                value: 'USA',
              },
            ],
            output: [
              {
                valueCode: 'mother',
                valueId: 'nationality',
                value: 'GBR',
              },
            ],
          },
        ],
      })

      const result = transform(registration, birthResolver, 'birth')
      console.log(JSON.stringify(result, null, 2))

      const registerAction = result.actions.find(
        (a) => a.type === 'REGISTER'
      ) as Action
      const declareAction = result.actions.find(
        (a) => a.type === 'DECLARE'
      ) as Action
      const corrections = result.actions.filter(
        (a) => a.type === 'REQUEST_CORRECTION'
      ) as Action[]

      assertEquals(corrections.length, 2)

      // First correction (child.gender)
      assertEquals(corrections[0]?.declaration?.['child.gender'], 'female')
      assertEquals(corrections[0]?.annotation?.['child.gender'], 'male')
      assertEquals(corrections[0]?.annotation?.['mother.nationality'], 'USA')

      // Second correction (mother.nationality) - different field
      assertEquals(corrections[1]?.declaration?.['mother.nationality'], 'GBR')
      assertEquals(corrections[1]?.annotation?.['mother.nationality'], 'USA')
      assertEquals(corrections[1]?.annotation?.['child.gender'], 'female')

      // REGISTER and DECLARE should have BOTH reverse engineered values
      assertEquals(registerAction?.declaration?.['child.gender'], 'male')
      assertEquals(declareAction?.declaration?.['child.gender'], 'male')
      assertEquals(registerAction?.declaration?.['mother.nationality'], 'USA')
      assertEquals(declareAction?.declaration?.['mother.nationality'], 'USA')
    }
  )
})
