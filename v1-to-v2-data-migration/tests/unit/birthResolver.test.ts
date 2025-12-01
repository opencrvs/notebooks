import { transform } from '../../helpers/transform.ts'
import { assertEquals } from 'https://deno.land/std@0.210.0/assert/mod.ts'
import defaultResolvers, {
  defaultBirthResolver,
} from '../../helpers/defaultResolvers.ts'
import { countryResolver } from '../../countryData/countryResolvers.ts'
import { EventRegistration } from '../../helpers/types.ts'

// Construct birthResolver as in migrate.ipynb
const allResolvers = { ...defaultResolvers, ...countryResolver }
const birthResolver = { ...defaultBirthResolver, ...allResolvers }

function buildEventRegistration(
  overrides?: Partial<EventRegistration>
): EventRegistration {
  return {
    id: '123',
    registration: {
      trackingId: 'B123456',
      registrationNumber: '2024B123456',
      contactPhoneNumber: '+2600987654321',
      contactEmail: 'test@example.com',
      informantsSignature: 'data:image/png;base64,abc123',
    },
    history: [
      {
        date: '2024-01-01T10:00:00Z',
        regStatus: 'DECLARED',
        user: { id: 'user1', role: { id: 'FIELD_AGENT' } },
        office: { id: 'office1' },
      },
    ],
    ...overrides,
  }
}

Deno.test('birthResolver - child fields', async (t) => {
  await t.step('should resolve child.name fields', () => {
    const registration = buildEventRegistration({
      child: {
        name: [
          {
            firstNames: 'John',
            middleName: 'Paul',
            familyName: 'Smith',
          },
        ],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['child.name'], {
      firstname: 'John',
      middleName: 'Paul',
      surname: 'Smith',
    })
  })

  await t.step('should resolve child.gender', () => {
    const registration = buildEventRegistration({
      child: { gender: 'male' },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['child.gender'], 'male')
  })

  await t.step('should resolve child.dob', () => {
    const registration = buildEventRegistration({
      child: { birthDate: '2024-01-15' },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['child.dob'], '2024-01-15')
  })

  await t.step('should resolve child.placeOfBirth', () => {
    const registration = buildEventRegistration({
      eventLocation: { type: 'HEALTH_FACILITY', id: 'facility1' },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['child.placeOfBirth'],
      'HEALTH_FACILITY'
    )
  })

  await t.step('should resolve child.birthLocation for HEALTH_FACILITY', () => {
    const registration = buildEventRegistration({
      eventLocation: { type: 'HEALTH_FACILITY', id: 'facility1' },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['child.birthLocation'], 'facility1')
  })

  await t.step(
    'should resolve child.birthLocation.privateHome for PRIVATE_HOME',
    () => {
      const registration = buildEventRegistration({
        eventLocation: {
          type: 'PRIVATE_HOME',
          address: {
            line: ['123', 'Main St', 'City', '', '', 'URBAN'],
            district: 'District1',
            state: 'State1',
            city: 'City1',
            country: 'FAR',
            postalCode: '12345',
          },
        },
      })

      const result = transform(registration, birthResolver, 'birth')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(
        declareAction?.declaration['child.birthLocation.privateHome']
          ?.administrativeArea,
        'District1'
      )
      assertEquals(
        declareAction?.declaration['child.birthLocation.privateHome']?.country,
        'FAR'
      )
    }
  )

  await t.step('should resolve child.birthLocation.other for OTHER', () => {
    const registration = buildEventRegistration({
      eventLocation: {
        type: 'OTHER',
        address: {
          line: ['456', 'Other St', 'Town'],
          district: 'District2',
          state: 'State2',
          city: 'City2',
          country: 'FAR',
          postalCode: '54321',
        },
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['child.birthLocation.other']
        ?.administrativeArea,
      'District2'
    )
  })

  await t.step('should resolve child.attendantAtBirth', () => {
    const registration = buildEventRegistration({
      attendantAtBirth: 'PHYSICIAN',
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['child.attendantAtBirth'],
      'PHYSICIAN'
    )
  })

  await t.step('should resolve child.birthType', () => {
    const registration = buildEventRegistration({
      birthType: 'TWIN',
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['child.birthType'], 'TWIN')
  })

  await t.step('should resolve child.weightAtBirth', () => {
    const registration = buildEventRegistration({
      weightAtBirth: 3.5,
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['child.weightAtBirth'], 3.5)
  })

  await t.step('should resolve child.reason from questionnaire', () => {
    const registration = buildEventRegistration({
      questionnaire: [
        {
          fieldId: 'birth.child.child-view-group.reasonForLateRegistration',
          value: 'Late notification',
        },
      ],
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['child.reason'],
      'Late notification'
    )
  })

  await t.step('should resolve child.nid', () => {
    const registration = buildEventRegistration({
      child: {
        identifier: [{ id: '1234567890', type: 'NATIONAL_ID' }],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['child.nid'], '1234567890')
  })
})

Deno.test('birthResolver - mother fields', async (t) => {
  await t.step('should resolve mother.detailsNotAvailable when false', () => {
    const registration = buildEventRegistration({
      mother: { detailsExist: true },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['mother.detailsNotAvailable'],
      false
    )
  })

  await t.step('should resolve mother.detailsNotAvailable when true', () => {
    const registration = buildEventRegistration({
      mother: { detailsExist: false },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.detailsNotAvailable'], true)
  })

  await t.step('should resolve mother.reason', () => {
    const registration = buildEventRegistration({
      mother: { reasonNotApplying: 'Mother unknown' },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.reason'], 'Mother unknown')
  })

  await t.step('should resolve mother.name', () => {
    const registration = buildEventRegistration({
      mother: {
        name: [
          {
            firstNames: 'Jane',
            middleName: 'Marie',
            familyName: 'Doe',
          },
        ],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.name'], {
      firstname: 'Jane',
      middleName: 'Marie',
      surname: 'Doe',
    })
  })

  await t.step('should resolve mother.dob', () => {
    const registration = buildEventRegistration({
      mother: { birthDate: '1990-05-15' },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.dob'], '1990-05-15')
  })

  await t.step('should resolve mother.dobUnknown', () => {
    const registration = buildEventRegistration({
      mother: { exactDateOfBirthUnknown: true },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.dobUnknown'], true)
  })

  await t.step('should resolve mother.age with asOfDateRef', () => {
    const registration = buildEventRegistration({
      mother: { ageOfIndividualInYears: 30 },
      child: { birthDate: '2024-01-15' },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.age'], {
      age: 30,
      asOfDateRef: 'child.dob',
    })
  })

  await t.step('should resolve mother.nationality', () => {
    const registration = buildEventRegistration({
      mother: { nationality: ['FAR'] },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.nationality'], 'FAR')
  })

  await t.step('should resolve mother.maritalStatus', () => {
    const registration = buildEventRegistration({
      mother: { maritalStatus: 'MARRIED' },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.maritalStatus'], 'MARRIED')
  })

  await t.step('should resolve mother.educationalAttainment', () => {
    const registration = buildEventRegistration({
      mother: { educationalAttainment: 'ISCED_4' },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['mother.educationalAttainment'],
      'ISCED_4'
    )
  })

  await t.step('should resolve mother.occupation', () => {
    const registration = buildEventRegistration({
      mother: { occupation: 'Teacher' },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.occupation'], 'Teacher')
  })

  await t.step('should resolve mother.previousBirths', () => {
    const registration = buildEventRegistration({
      mother: { multipleBirth: 2 },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.previousBirths'], 2)
  })

  await t.step('should resolve mother.address', () => {
    const registration = buildEventRegistration({
      mother: {
        address: [
          {
            type: 'PRIMARY_ADDRESS',
            line: ['10', 'Mother St', 'City', '', '', 'URBAN'],
            country: 'FAR',
            district: 'District1',
            state: 'State1',
            city: 'City1',
            postalCode: '11111',
          },
        ],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.address']?.country, 'FAR')
    assertEquals(
      declareAction?.declaration['mother.address']?.administrativeArea,
      'District1'
    )
  })

  await t.step('should resolve mother.brn', () => {
    const registration = buildEventRegistration({
      mother: {
        identifier: [{ id: 'B2020123456', type: 'BIRTH_REGISTRATION_NUMBER' }],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.brn'], 'B2020123456')
  })

  await t.step('should resolve mother.nid', () => {
    const registration = buildEventRegistration({
      mother: {
        identifier: [{ id: '9876543210', type: 'NATIONAL_ID' }],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.nid'], '9876543210')
  })

  await t.step('should resolve mother.passport', () => {
    const registration = buildEventRegistration({
      mother: {
        identifier: [{ id: 'P123456', type: 'PASSPORT' }],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.passport'], 'P123456')
  })

  await t.step('should resolve mother.idType from questionnaire', () => {
    const registration = buildEventRegistration({
      questionnaire: [
        {
          fieldId: 'birth.mother.mother-view-group.motherIdType',
          value: 'NATIONAL_ID',
        },
      ],
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.idType'], 'NATIONAL_ID')
  })

  await t.step('should resolve mother.verified from questionnaire', () => {
    const registration = buildEventRegistration({
      questionnaire: [
        {
          fieldId: 'birth.mother.mother-view-group.verified',
          value: 'verified',
        },
      ],
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.verified'], 'verified')
  })
})

Deno.test('birthResolver - father fields', async (t) => {
  await t.step('should resolve father.detailsNotAvailable', () => {
    const registration = buildEventRegistration({
      father: { detailsExist: false },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['father.detailsNotAvailable'], true)
  })

  await t.step('should resolve father.reason', () => {
    const registration = buildEventRegistration({
      father: { reasonNotApplying: 'Father unknown' },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['father.reason'], 'Father unknown')
  })

  await t.step('should resolve father.name', () => {
    const registration = buildEventRegistration({
      father: {
        name: [
          {
            firstNames: 'Michael',
            familyName: 'Smith',
          },
        ],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['father.name'], {
      firstname: 'Michael',
      middleName: undefined,
      surname: 'Smith',
    })
  })

  await t.step('should resolve father.dob', () => {
    const registration = buildEventRegistration({
      father: { birthDate: '1988-03-20' },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['father.dob'], '1988-03-20')
  })

  await t.step('should resolve father.dobUnknown', () => {
    const registration = buildEventRegistration({
      father: { exactDateOfBirthUnknown: true },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['father.dobUnknown'], true)
  })

  await t.step('should resolve father.age', () => {
    const registration = buildEventRegistration({
      father: { ageOfIndividualInYears: 35 },
      child: { birthDate: '2024-01-15' },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['father.age'], {
      age: 35,
      asOfDateRef: 'child.dob',
    })
  })

  await t.step('should resolve father.nationality', () => {
    const registration = buildEventRegistration({
      father: { nationality: ['USA'] },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['father.nationality'], 'USA')
  })

  await t.step('should resolve father.maritalStatus', () => {
    const registration = buildEventRegistration({
      father: { maritalStatus: 'MARRIED' },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['father.maritalStatus'], 'MARRIED')
  })

  await t.step('should resolve father.educationalAttainment', () => {
    const registration = buildEventRegistration({
      father: { educationalAttainment: 'ISCED_5' },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['father.educationalAttainment'],
      'ISCED_5'
    )
  })

  await t.step('should resolve father.occupation', () => {
    const registration = buildEventRegistration({
      father: { occupation: 'Engineer' },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['father.occupation'], 'Engineer')
  })

  await t.step('should resolve father.address', () => {
    const registration = buildEventRegistration({
      father: {
        address: [
          {
            type: 'PRIMARY_ADDRESS',
            line: ['20', 'Father Ave', 'Town'],
            country: 'FAR',
            district: 'District2',
            state: 'State2',
            city: 'City2',
            postalCode: '22222',
          },
        ],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['father.address']?.country, 'FAR')
    assertEquals(
      declareAction?.declaration['father.address']?.administrativeArea,
      'District2'
    )
  })

  await t.step(
    'should resolve father.addressSameAs when addresses match',
    () => {
      const sameAddress = {
        type: 'PRIMARY_ADDRESS' as const,
        line: ['10', 'Same St', 'City'],
        country: 'FAR',
        district: 'District1',
        state: 'State1',
        city: 'City1',
        postalCode: '11111',
      }

      const registration = buildEventRegistration({
        mother: { address: [sameAddress] },
        father: { address: [sameAddress] },
      })

      const result = transform(registration, birthResolver, 'birth')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(declareAction?.declaration['father.addressSameAs'], 'YES')
    }
  )

  await t.step(
    'should resolve father.addressSameAs when addresses differ',
    () => {
      const registration = buildEventRegistration({
        mother: {
          address: [
            {
              type: 'PRIMARY_ADDRESS',
              line: ['10', 'Mother St'],
              country: 'FAR',
              district: 'District1',
            },
          ],
        },
        father: {
          address: [
            {
              type: 'PRIMARY_ADDRESS',
              line: ['20', 'Father Ave'],
              country: 'FAR',
              district: 'District2',
            },
          ],
        },
      })

      const result = transform(registration, birthResolver, 'birth')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(declareAction?.declaration['father.addressSameAs'], 'NO')
    }
  )

  await t.step('should resolve father.brn', () => {
    const registration = buildEventRegistration({
      father: {
        identifier: [{ id: 'B2018654321', type: 'BIRTH_REGISTRATION_NUMBER' }],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['father.brn'], 'B2018654321')
  })

  await t.step('should resolve father.nid', () => {
    const registration = buildEventRegistration({
      father: {
        identifier: [{ id: '1122334455', type: 'NATIONAL_ID' }],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['father.nid'], '1122334455')
  })

  await t.step('should resolve father.passport', () => {
    const registration = buildEventRegistration({
      father: {
        identifier: [{ id: 'P654321', type: 'PASSPORT' }],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['father.passport'], 'P654321')
  })

  await t.step('should resolve father.idType from questionnaire', () => {
    const registration = buildEventRegistration({
      questionnaire: [
        {
          fieldId: 'birth.father.father-view-group.fatherIdType',
          value: 'PASSPORT',
        },
      ],
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['father.idType'], 'PASSPORT')
  })

  await t.step('should resolve father.verified from questionnaire', () => {
    const registration = buildEventRegistration({
      questionnaire: [
        {
          fieldId: 'birth.father.father-view-group.verified',
          value: 'failed',
        },
      ],
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['father.verified'], 'failed')
  })
})

Deno.test('birthResolver - informant fields', async (t) => {
  await t.step('should resolve informant.dob for non-special informant', () => {
    const registration = buildEventRegistration({
      informant: {
        birthDate: '1995-08-10',
        relationship: 'BROTHER',
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.dob'], '1995-08-10')
  })

  await t.step('should not resolve informant.dob for MOTHER', () => {
    const registration = buildEventRegistration({
      informant: {
        birthDate: '1995-08-10',
        relationship: 'MOTHER',
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.dob'], undefined)
  })

  await t.step(
    'should resolve informant.address for non-special informant',
    () => {
      const registration = buildEventRegistration({
        informant: {
          relationship: 'GRANDFATHER',
          address: [
            {
              type: 'PRIMARY_ADDRESS',
              line: ['30', 'Informant Rd'],
              country: 'FAR',
              district: 'District3',
              state: 'State3',
              city: 'City3',
              postalCode: '33333',
            },
          ],
        },
      })

      const result = transform(registration, birthResolver, 'birth')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(
        declareAction?.declaration['informant.address']?.administrativeArea,
        'District3'
      )
    }
  )

  await t.step(
    'should resolve informant.phoneNo with country code stripped',
    () => {
      const registration = buildEventRegistration({
        registration: {
          trackingId: 'B123456',
          contactPhoneNumber: '+260987654321',
        },
      })

      const result = transform(registration, birthResolver, 'birth')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(
        declareAction?.declaration['informant.phoneNo'],
        '0987654321'
      )
    }
  )

  await t.step('should resolve informant.email', () => {
    const registration = buildEventRegistration({
      registration: {
        trackingId: 'B123456',
        contactEmail: 'informant@test.com',
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['informant.email'],
      'informant@test.com'
    )
  })

  await t.step('should resolve informant.relation', () => {
    const registration = buildEventRegistration({
      informant: { relationship: 'SISTER' },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.relation'], 'SISTER')
  })

  await t.step('should resolve informant.other.relation', () => {
    const registration = buildEventRegistration({
      informant: { otherRelationship: 'Cousin' },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['informant.other.relation'],
      'Cousin'
    )
  })

  await t.step(
    'should resolve informant.name for non-special informant',
    () => {
      const registration = buildEventRegistration({
        informant: {
          relationship: 'LEGAL_GUARDIAN',
          name: [
            {
              firstNames: 'Guardian',
              familyName: 'Jones',
            },
          ],
        },
      })

      const result = transform(registration, birthResolver, 'birth')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(declareAction?.declaration['informant.name'], {
        firstname: 'Guardian',
        middleName: undefined,
        surname: 'Jones',
      })
    }
  )

  await t.step('should resolve informant.dobUnknown', () => {
    const registration = buildEventRegistration({
      informant: {
        relationship: 'GRANDFATHER',
        exactDateOfBirthUnknown: true,
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.dobUnknown'], true)
  })

  await t.step('should resolve informant.age', () => {
    const registration = buildEventRegistration({
      informant: {
        relationship: 'OTHER',
        ageOfIndividualInYears: 45,
      },
      child: { birthDate: '2024-01-15' },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.age'], {
      age: 45,
      asOfDateRef: 'child.dob',
    })
  })

  await t.step('should resolve informant.nationality', () => {
    const registration = buildEventRegistration({
      informant: {
        relationship: 'BROTHER',
        nationality: ['GBR'],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.nationality'], 'GBR')
  })

  await t.step('should resolve informant.brn', () => {
    const registration = buildEventRegistration({
      informant: {
        relationship: 'SISTER',
        identifier: [{ id: 'B2015987654', type: 'BIRTH_REGISTRATION_NUMBER' }],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.brn'], 'B2015987654')
  })

  await t.step('should resolve informant.nid', () => {
    const registration = buildEventRegistration({
      informant: {
        relationship: 'GRANDFATHER',
        identifier: [{ id: '5566778899', type: 'NATIONAL_ID' }],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.nid'], '5566778899')
  })

  await t.step('should resolve informant.passport', () => {
    const registration = buildEventRegistration({
      informant: {
        relationship: 'OTHER',
        identifier: [{ id: 'P999888', type: 'PASSPORT' }],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.passport'], 'P999888')
  })

  await t.step('should resolve informant.idType from questionnaire', () => {
    const registration = buildEventRegistration({
      questionnaire: [
        {
          fieldId: 'birth.informant.informant-view-group.informantIdType',
          value: 'BIRTH_REGISTRATION_NUMBER',
        },
      ],
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['informant.idType'],
      'BIRTH_REGISTRATION_NUMBER'
    )
  })

  await t.step('should resolve informant.verified from questionnaire', () => {
    const registration = buildEventRegistration({
      questionnaire: [
        {
          fieldId: 'birth.informant.informant-view-group.verified',
          value: 'authenticated',
        },
      ],
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['informant.verified'],
      'authenticated'
    )
  })
})

Deno.test('birthResolver - documents fields', async (t) => {
  await t.step('should resolve documents.proofOfBirth', () => {
    const registration = buildEventRegistration({
      registration: {
        trackingId: 'B123456',
        attachments: [
          {
            uri: '/documents/birth-cert.pdf',
            contentType: 'application/pdf',
            type: 'BIRTH_CERTIFICATE',
            subject: 'CHILD',
          },
        ],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['documents.proofOfBirth'], {
      path: '/documents/birth-cert.pdf',
      originalFilename: '/documents/birth-cert.pdf',
      type: 'application/pdf',
    })
  })

  await t.step('should resolve documents.proofOfMother', () => {
    const registration = buildEventRegistration({
      registration: {
        trackingId: 'B123456',
        attachments: [
          {
            uri: '/documents/mother-id.pdf',
            contentType: 'application/pdf',
            type: 'NATIONAL_ID',
            subject: 'MOTHER',
          },
        ],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['documents.proofOfMother'], [
      {
        path: '/documents/mother-id.pdf',
        originalFilename: '/documents/mother-id.pdf',
        type: 'application/pdf',
        option: 'NATIONAL_ID',
      },
    ])
  })

  await t.step('should resolve documents.proofOfFather', () => {
    const registration = buildEventRegistration({
      registration: {
        trackingId: 'B123456',
        attachments: [
          {
            uri: '/documents/father-id.pdf',
            contentType: 'application/pdf',
            type: 'PASSPORT',
            subject: 'FATHER',
          },
        ],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['documents.proofOfFather'], [
      {
        path: '/documents/father-id.pdf',
        originalFilename: '/documents/father-id.pdf',
        type: 'application/pdf',
        option: 'PASSPORT',
      },
    ])
  })

  await t.step('should resolve documents.proofOfInformant', () => {
    const registration = buildEventRegistration({
      registration: {
        trackingId: 'B123456',
        attachments: [
          {
            uri: '/documents/informant-id.pdf',
            contentType: 'application/pdf',
            type: 'NATIONAL_ID',
            subject: 'INFORMANT_ID_PROOF',
          },
        ],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['documents.proofOfInformant'], [
      {
        path: '/documents/informant-id.pdf',
        originalFilename: '/documents/informant-id.pdf',
        type: 'application/pdf',
        option: 'NATIONAL_ID',
      },
    ])
  })

  await t.step(
    'should resolve documents.proofOther combining OTHER and LEGAL_GUARDIAN_PROOF',
    () => {
      const registration = buildEventRegistration({
        registration: {
          trackingId: 'B123456',
          attachments: [
            {
              uri: '/documents/other1.pdf',
              contentType: 'application/pdf',
              type: 'OTHER_DOCUMENT',
              subject: 'OTHER',
            },
            {
              uri: '/documents/guardian.pdf',
              contentType: 'application/pdf',
              type: 'GUARDIAN_PROOF',
              subject: 'LEGAL_GUARDIAN_PROOF',
            },
          ],
        },
      })

      const result = transform(registration, birthResolver, 'birth')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(declareAction?.declaration['documents.proofOther'], [
        {
          path: '/documents/other1.pdf',
          originalFilename: '/documents/other1.pdf',
          type: 'application/pdf',
          option: 'OTHER_DOCUMENT',
        },
        {
          path: '/documents/guardian.pdf',
          originalFilename: '/documents/guardian.pdf',
          type: 'application/pdf',
          option: 'GUARDIAN_PROOF',
        },
      ])
    }
  )
})
