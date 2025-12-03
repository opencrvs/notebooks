import { transform } from '../../helpers/transform.ts'
import {
  buildBirthResolver,
  buildDeathResolver,
  buildBirthEventRegistration,
  buildDeathEventRegistration,
} from '../utils/testHelpers.ts'
import { assertEquals } from 'https://deno.land/std@0.210.0/assert/mod.ts'

Deno.test('FAR Corrections - Address Fields', async (t) => {
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
              valueId: 'internationalStatePrimaryMother',
              value: 'OldState',
            },
            {
              valueCode: 'mother',
              valueId: 'internationalCityPrimaryMother',
              value: 'OldCity',
            },
          ],
          output: [
            {
              valueCode: 'mother',
              valueId: 'internationalStatePrimaryMother',
              value: 'NewState',
            },
            {
              valueCode: 'mother',
              valueId: 'internationalCityPrimaryMother',
              value: 'NewCity',
            },
            {
              valueCode: 'mother',
              valueId: 'internationalAddressLine1PrimaryMother',
              value: '123 Main St',
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
      correctionAction?.declaration?.['mother.address']?.streetLevelDetails,
      {
        state: 'NewState',
        cityOrTown: 'NewCity',
        addressLine1: '123 Main St',
      }
    )
    assertEquals(
      correctionAction?.annotation?.['mother.address']?.streetLevelDetails
        ?.state,
      'OldState'
    )
    assertEquals(
      correctionAction?.annotation?.['mother.address']?.streetLevelDetails
        ?.cityOrTown,
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
              valueId: 'internationalStatePlaceofdeath',
              value: 'OldState',
            },
            {
              valueCode: 'deathEvent',
              valueId: 'internationalCityPlaceofdeath',
              value: 'OldCity',
            },
          ],
          output: [
            {
              valueCode: 'deathEvent',
              valueId: 'internationalStatePlaceofdeath',
              value: 'NewState',
            },
            {
              valueCode: 'deathEvent',
              valueId: 'internationalCityPlaceofdeath',
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
        ?.streetLevelDetails?.state,
      'NewState'
    )
    assertEquals(
      correctionAction?.declaration?.['eventDetails.deathLocationOther']
        ?.streetLevelDetails?.cityOrTown,
      'NewCity'
    )
    assertEquals(
      correctionAction?.annotation?.['eventDetails.deathLocationOther']
        ?.streetLevelDetails?.state,
      'OldState'
    )
    assertEquals(
      correctionAction?.annotation?.['eventDetails.deathLocationOther']
        ?.streetLevelDetails?.cityOrTown,
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
                valueId: 'internationalStatePrimaryInformant',
                value: 'OldState',
              },
              {
                valueCode: 'informant',
                valueId: 'internationalDistrictPrimaryInformant',
                value: 'OldDistrict',
              },
              {
                valueCode: 'informant',
                valueId: 'internationalCityPrimaryInformant',
                value: 'OldCity',
              },
              {
                valueCode: 'informant',
                valueId: 'internationalPostalCodePrimaryInformant',
                value: '12345',
              },
            ],
            output: [
              {
                valueCode: 'informant',
                valueId: 'internationalStatePrimaryInformant',
                value: 'NewState',
              },
              {
                valueCode: 'informant',
                valueId: 'internationalDistrictPrimaryInformant',
                value: 'NewDistrict',
              },
              {
                valueCode: 'informant',
                valueId: 'internationalCityPrimaryInformant',
                value: 'NewCity',
              },
              {
                valueCode: 'informant',
                valueId: 'internationalPostalCodePrimaryInformant',
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
          ?.state,
        'NewState'
      )
      assertEquals(
        correctionAction?.declaration?.['informant.address']?.streetLevelDetails
          ?.district2,
        'NewDistrict'
      )
      assertEquals(
        correctionAction?.declaration?.['informant.address']?.streetLevelDetails
          ?.cityOrTown,
        'NewCity'
      )
      assertEquals(
        correctionAction?.declaration?.['informant.address']?.streetLevelDetails
          ?.postcodeOrZip,
        '54321'
      )
      assertEquals(
        correctionAction?.annotation?.['informant.address']?.streetLevelDetails
          ?.state,
        'OldState'
      )
      assertEquals(
        correctionAction?.annotation?.['informant.address']?.streetLevelDetails
          ?.district2,
        'OldDistrict'
      )
      assertEquals(
        correctionAction?.annotation?.['informant.address']?.streetLevelDetails
          ?.cityOrTown,
        'OldCity'
      )
      assertEquals(
        correctionAction?.annotation?.['informant.address']?.streetLevelDetails
          ?.postcodeOrZip,
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
                valueId: 'internationalStatePrimaryFather',
                value: 'OldState',
              },
            ],
            output: [
              {
                valueCode: 'father',
                valueId: 'internationalStatePrimaryFather',
                value: 'NewState',
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
          ?.state,
        'NewState'
      )
    }
  )
})
