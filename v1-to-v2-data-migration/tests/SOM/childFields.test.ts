import { transform } from '../../helpers/transform.ts'
import { assertEquals } from 'https://deno.land/std@0.210.0/assert/mod.ts'
import {
  buildBirthResolver,
  buildBirthEventRegistration,
} from '../utils/testHelpers.ts'

// Construct resolver as in migrate.ipynb
const birthResolver = buildBirthResolver()

Deno.test('SOM child fields tests', async (t) => {
  await t.step('should resolve child.nid when NATIONAL_ID is present', () => {
    const registration = buildBirthEventRegistration({
      child: {
        identifier: [
          {
            type: 'NATIONAL_ID',
            id: 'NID123456',
          },
        ],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['child.nid'], 'NID123456')
  })

  await t.step('should not resolve child.nid when no NATIONAL_ID', () => {
    const registration = buildBirthEventRegistration({
      child: {
        identifier: [
          {
            type: 'BIRTH_REGISTRATION_NUMBER',
            id: 'BRN123456',
          },
        ],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['child.nid'], undefined)
  })

  await t.step('should resolve child.attendantName', () => {
    const registration = buildBirthEventRegistration({
      questionnaire: [
        {
          fieldId: 'birth.child.child-view-group.birthAttendantName',
          value: 'Dr. Smith Attendant',
        },
      ],
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['child.attendantName'],
      'Dr. Smith Attendant'
    )
  })

  await t.step('should resolve child.attedantAtBirthId', () => {
    const registration = buildBirthEventRegistration({
      questionnaire: [
        {
          fieldId: 'birth.child.child-view-group.birthAttendantId',
          value: 'ATTENDANT12345',
        },
      ],
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['child.attedantAtBirthId'],
      'ATTENDANT12345'
    )
  })

  await t.step('should resolve custom child address for domestic', () => {
    const registration = buildBirthEventRegistration({
      questionnaire: [
        {
          fieldId: 'birth.child.child-view-group.countryPrimaryChild',
          value: 'SOM',
        },
        {
          fieldId: 'birth.child.child-view-group.districtPrimaryChild',
          value: 'Banadir',
        },
        {
          fieldId: 'birth.child.child-view-group.cityPrimaryChild',
          value: 'Mogadishu',
        },
        {
          fieldId: 'birth.child.child-view-group.addressLine1PrimaryChild',
          value: '123',
        },
        {
          fieldId: 'birth.child.child-view-group.addressLine2PrimaryChild',
          value: 'Main St',
        },
        {
          fieldId: 'birth.child.child-view-group.addressLine3PrimaryChild',
          value: 'Residential Area',
        },
        {
          fieldId: 'birth.child.child-view-group.postalCodePrimaryChild',
          value: '12345',
        },
      ],
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['child.address']?.addressType,
      'DOMESTIC'
    )
    assertEquals(declareAction?.declaration['child.address']?.country, 'SOM')
    assertEquals(
      declareAction?.declaration['child.address']?.administrativeArea,
      'Banadir'
    )
    assertEquals(
      declareAction?.declaration['child.address']?.streetLevelDetails?.city,
      'Mogadishu'
    )
    assertEquals(
      declareAction?.declaration['child.address']?.streetLevelDetails?.number,
      '123'
    )
    assertEquals(
      declareAction?.declaration['child.address']?.streetLevelDetails?.street,
      'Main St'
    )
    assertEquals(
      declareAction?.declaration['child.address']?.streetLevelDetails
        ?.residentialArea,
      'Residential Area'
    )
    assertEquals(
      declareAction?.declaration['child.address']?.streetLevelDetails?.zipCode,
      '12345'
    )
  })

  await t.step('should resolve custom child address for international', () => {
    const registration = buildBirthEventRegistration({
      questionnaire: [
        {
          fieldId: 'birth.child.child-view-group.countryPrimaryChild',
          value: 'KEN',
        },
        {
          fieldId: 'birth.child.child-view-group.districtPrimaryChild',
          value: 'Nairobi',
        },
        {
          fieldId: 'birth.child.child-view-group.internationalCityPrimaryChild',
          value: 'Nairobi City',
        },
      ],
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['child.address']?.addressType,
      'INTERNATIONAL'
    )
    assertEquals(declareAction?.declaration['child.address']?.country, 'KEN')
    assertEquals(
      declareAction?.declaration['child.address']?.administrativeArea,
      'Nairobi'
    )
    assertEquals(
      declareAction?.declaration['child.address']?.streetLevelDetails
        ?.internationalCity,
      'Nairobi City'
    )
  })

  await t.step(
    'should resolve child.birthLocation.privateHome for PRIVATE_HOME',
    () => {
      const registration = buildBirthEventRegistration({
        eventLocation: {
          type: 'PRIVATE_HOME',
          address: {
            line: ['123', 'Main St', 'Residential Area', '', '', 'URBAN'],
            district: 'Banadir',
            state: 'Banadir',
            city: 'Mogadishu',
            country: 'SOM',
            postalCode: '12345',
          },
        },
      })

      const result = transform(registration, birthResolver, 'birth')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(
        declareAction?.declaration['child.birthLocation.privateHome']
          ?.addressType,
        'DOMESTIC'
      )
      assertEquals(
        declareAction?.declaration['child.birthLocation.privateHome']?.country,
        'SOM'
      )
      assertEquals(
        declareAction?.declaration['child.birthLocation.privateHome']
          ?.administrativeArea,
        'Banadir'
      )
      assertEquals(
        declareAction?.declaration['child.birthLocation.privateHome']
          ?.streetLevelDetails?.city,
        'Mogadishu'
      )
    }
  )

  await t.step(
    'should not resolve child.birthLocation.privateHome for non-PRIVATE_HOME',
    () => {
      const registration = buildBirthEventRegistration({
        eventLocation: {
          type: 'HEALTH_FACILITY',
          address: {
            line: ['456 Hospital Rd'],
            district: 'Banadir',
            country: 'SOM',
          },
        },
      })

      const result = transform(registration, birthResolver, 'birth')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(
        declareAction?.declaration['child.birthLocation.privateHome'],
        undefined
      )
    }
  )

  await t.step('should resolve child.birthLocation.other for OTHER', () => {
    const registration = buildBirthEventRegistration({
      eventLocation: {
        type: 'OTHER',
        address: {
          line: ['789', 'Other St', 'Area'],
          district: 'Lower Shabelle',
          state: 'Lower Shabelle',
          city: 'Afgooye',
          country: 'SOM',
          postalCode: '54321',
        },
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['child.birthLocation.other']?.addressType,
      'DOMESTIC'
    )
    assertEquals(
      declareAction?.declaration['child.birthLocation.other']?.country,
      'SOM'
    )
    assertEquals(
      declareAction?.declaration['child.birthLocation.other']
        ?.administrativeArea,
      'Lower Shabelle'
    )
  })

  await t.step(
    'should not resolve child.birthLocation.other for non-OTHER',
    () => {
      const registration = buildBirthEventRegistration({
        eventLocation: {
          type: 'HEALTH_FACILITY',
          address: {
            line: ['456 Hospital Rd'],
            district: 'Banadir',
            country: 'SOM',
          },
        },
      })

      const result = transform(registration, birthResolver, 'birth')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(
        declareAction?.declaration['child.birthLocation.other'],
        undefined
      )
    }
  )
})
