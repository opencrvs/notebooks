import { transform } from '../../helpers/transform.ts'
import {
  buildBirthResolver,
  buildDeathResolver,
  buildBirthEventRegistration,
  buildDeathEventRegistration,
} from '../utils/testHelpers.ts'
import { assertEquals } from 'https://deno.land/std@0.210.0/assert/mod.ts'

Deno.test('SOM Corrections - Address Fields', async (t) => {
  const birthResolver = buildBirthResolver()
  const deathResolver = buildDeathResolver()

  await t.step('should transform address field corrections in birth', () => {
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
          action: 'REQUESTED_CORRECTION',
          user: { id: 'user2', role: { id: 'REGISTRATION_AGENT' } },
          office: { id: 'office1' },
          input: [
            {
              valueCode: 'mother',
              valueId: 'internationalCityPrimaryMother',
              value: 'OldInternationalCity',
            },
            {
              valueCode: 'mother',
              valueId: 'cityPrimaryMother',
              value: 'OldCity',
            },
          ],
          output: [
            {
              valueCode: 'mother',
              valueId: 'internationalCityPrimaryMother',
              value: 'NewInternationalCity',
            },
            {
              valueCode: 'mother',
              valueId: 'cityPrimaryMother',
              value: 'NewCity',
            },
            {
              valueCode: 'mother',
              valueId: 'addressLine1PrimaryMother',
              value: 'ResidentialArea',
            },
          ],
        },
      ],
    })

    const result = transform(registration, birthResolver, 'birth')
    const correctionAction = result.actions.find(
      (a) => a.type === 'REQUEST_CORRECTION'
    )

    assertEquals(
      correctionAction?.declaration?.['mother.address']?.streetLevelDetails
        ?.internationalCity,
      'NewInternationalCity'
    )
    assertEquals(
      correctionAction?.declaration?.['mother.address']?.streetLevelDetails
        ?.city,
      'NewCity'
    )
    assertEquals(
      correctionAction?.declaration?.['mother.address']?.streetLevelDetails
        ?.residentialArea,
      'ResidentialArea'
    )
    assertEquals(
      correctionAction?.annotation?.['mother.address']?.streetLevelDetails
        ?.internationalCity,
      'OldInternationalCity'
    )
    assertEquals(
      correctionAction?.annotation?.['mother.address']?.streetLevelDetails
        ?.city,
      'OldCity'
    )
  })

  await t.step('should transform death location address corrections', () => {
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
          action: 'REQUESTED_CORRECTION',
          user: { id: 'user2', role: { id: 'REGISTRATION_AGENT' } },
          office: { id: 'office1' },
          input: [
            {
              valueCode: 'deathEvent',
              valueId: 'internationalCityPlaceofdeath',
              value: 'OldInternationalCity',
            },
            {
              valueCode: 'deathEvent',
              valueId: 'cityPlaceofdeath',
              value: 'OldCity',
            },
          ],
          output: [
            {
              valueCode: 'deathEvent',
              valueId: 'internationalCityPlaceofdeath',
              value: 'NewInternationalCity',
            },
            {
              valueCode: 'deathEvent',
              valueId: 'cityPlaceofdeath',
              value: 'NewCity',
            },
          ],
        },
      ],
    })

    const result = transform(registration, deathResolver, 'death')
    const correctionAction = result.actions.find(
      (a) => a.type === 'REQUEST_CORRECTION'
    )

    assertEquals(
      correctionAction?.declaration?.['eventDetails.deathLocationOther']
        ?.streetLevelDetails?.internationalCity,
      'NewInternationalCity'
    )
    assertEquals(
      correctionAction?.declaration?.['eventDetails.deathLocationOther']
        ?.streetLevelDetails?.city,
      'NewCity'
    )
    assertEquals(
      correctionAction?.annotation?.['eventDetails.deathLocationOther']
        ?.streetLevelDetails?.internationalCity,
      'OldInternationalCity'
    )
    assertEquals(
      correctionAction?.annotation?.['eventDetails.deathLocationOther']
        ?.streetLevelDetails?.city,
      'OldCity'
    )
  })

  await t.step(
    'should transform informant address corrections in death',
    () => {
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
            action: 'REQUESTED_CORRECTION',
            user: { id: 'user2', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
            input: [
              {
                valueCode: 'informant',
                valueId: 'internationalCityPrimaryInformant',
                value: 'OldInternationalCity',
              },
              {
                valueCode: 'informant',
                valueId: 'cityPrimaryInformant',
                value: 'OldCity',
              },
              {
                valueCode: 'informant',
                valueId: 'postalCodePrimaryInformant',
                value: '12345',
              },
            ],
            output: [
              {
                valueCode: 'informant',
                valueId: 'internationalCityPrimaryInformant',
                value: 'NewInternationalCity',
              },
              {
                valueCode: 'informant',
                valueId: 'cityPrimaryInformant',
                value: 'NewCity',
              },
              {
                valueCode: 'informant',
                valueId: 'postalCodePrimaryInformant',
                value: '54321',
              },
            ],
          },
        ],
      })

      const result = transform(registration, deathResolver, 'death')
      const correctionAction = result.actions.find(
        (a) => a.type === 'REQUEST_CORRECTION'
      )

      // Check individual fields to avoid default field interference
      assertEquals(
        correctionAction?.declaration?.['informant.address']?.streetLevelDetails
          ?.internationalCity,
        'NewInternationalCity'
      )
      assertEquals(
        correctionAction?.declaration?.['informant.address']?.streetLevelDetails
          ?.city,
        'NewCity'
      )
      assertEquals(
        correctionAction?.declaration?.['informant.address']?.streetLevelDetails
          ?.zipCode,
        '54321'
      )
      assertEquals(
        correctionAction?.annotation?.['informant.address']?.streetLevelDetails
          ?.internationalCity,
        'OldInternationalCity'
      )
      assertEquals(
        correctionAction?.annotation?.['informant.address']?.streetLevelDetails
          ?.city,
        'OldCity'
      )
      assertEquals(
        correctionAction?.annotation?.['informant.address']?.streetLevelDetails
          ?.zipCode,
        '12345'
      )
    }
  )

  await t.step(
    'should preserve addressType when correcting address fields',
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
            action: 'REQUESTED_CORRECTION',
            user: { id: 'user2', role: { id: 'REGISTRATION_AGENT' } },
            office: { id: 'office1' },
            input: [
              {
                valueCode: 'father',
                valueId: 'internationalCityPrimaryFather',
                value: 'OldInternationalCity',
              },
            ],
            output: [
              {
                valueCode: 'father',
                valueId: 'internationalCityPrimaryFather',
                value: 'NewInternationalCity',
              },
            ],
          },
        ],
      })

      const result = transform(registration, birthResolver, 'birth')
      const correctionAction = result.actions.find(
        (a) => a.type === 'REQUEST_CORRECTION'
      )

      // Should have addressType set based on country/international fields
      assertEquals(
        correctionAction?.declaration?.['father.address']?.addressType !==
          undefined,
        true
      )
      assertEquals(
        correctionAction?.declaration?.['father.address']?.streetLevelDetails
          ?.internationalCity,
        'NewInternationalCity'
      )
    }
  )
})
