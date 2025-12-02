import { assertEquals } from 'jsr:@std/assert'
import { transform } from '../../helpers/transform.ts'
import defaultResolvers, {
  defaultDeathResolver,
} from '../../helpers/defaultResolvers.ts'
import { countryResolver } from '../../countryData/countryResolvers.ts'
import type { EventRegistration } from '../../helpers/types.ts'

// Construct deathResolver as in migrate.ipynb
const allResolvers = { ...defaultResolvers, ...countryResolver }
const deathResolver = { ...defaultDeathResolver, ...allResolvers }

function buildEventRegistration(
  overrides: Partial<EventRegistration> = {}
): EventRegistration {
  return {
    id: 'test-id',
    deceased: {
      id: 'deceased-id',
      name: [{ use: 'en', firstNames: 'John', familyName: 'Doe' }],
      gender: 'male',
      birthDate: '1950-01-01',
      identifier: [{ type: 'NATIONAL_ID', id: 'DEC123456' }],
      nationality: ['FAR'],
      maritalStatus: 'MARRIED',
      address: [
        {
          type: 'PRIMARY_ADDRESS',
          line: ['123 Main St', 'Apt 4'],
          district: 'District1',
          state: 'State1',
          country: 'FAR',
        },
      ],
      deceased: {
        deathDate: '2024-01-01',
      },
    },
    deathDate: '2024-01-01',
    informant: {
      id: 'informant-id',
      relationship: 'SON',
      name: [{ use: 'en', firstNames: 'Jane', familyName: 'Doe' }],
      birthDate: '1980-01-01',
      identifier: [{ type: 'NATIONAL_ID', id: 'INF789' }],
      address: [
        {
          type: 'PRIMARY_ADDRESS',
          line: ['456 Oak Ave'],
          district: 'District2',
          state: 'State2',
          country: 'FAR',
        },
      ],
    },
    spouse: {
      id: 'spouse-id',
      detailsExist: true,
      name: [{ use: 'en', firstNames: 'Mary', familyName: 'Smith' }],
      birthDate: '1952-01-01',
      nationality: ['FAR'],
      identifier: [{ type: 'NATIONAL_ID', id: 'SPO456' }],
      address: [
        {
          type: 'PRIMARY_ADDRESS',
          line: ['789 Pine Rd'],
          district: 'District3',
          state: 'State3',
          country: 'FAR',
        },
      ],
    },
    registration: {
      trackingId: 'DW12345',
      registrationNumber: 'REG123',
      contactPhoneNumber: '+260987654321',
      contactEmail: 'contact@example.com',
    },
    history: [
      {
        date: '2024-01-15T10:00:00.000Z',
        regStatus: 'DECLARED',
        user: { id: 'user-id', role: { id: 'FIELD_AGENT' } },
        office: { id: 'office-id' },
      },
    ],
    eventLocation: {
      id: 'location-id',
      type: 'HEALTH_FACILITY',
    },
    causeOfDeathEstablished: 'true',
    causeOfDeathMethod: 'PHYSICIAN',
    mannerOfDeath: 'NATURAL_CAUSES',
    questionnaire: [],
    ...overrides,
  } as EventRegistration
}

Deno.test('deathResolver - deceased fields', async (t) => {
  await t.step('should resolve deceased.name', () => {
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.name'], {
      firstname: 'John',
      middleName: undefined,
      surname: 'Doe',
    })
  })

  await t.step('should resolve deceased.gender', () => {
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.gender'], 'male')
  })

  await t.step('should resolve deceased.dob', () => {
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.dob'], '1950-01-01')
  })

  await t.step('should resolve deceased.dobUnknown', () => {
    const data = buildEventRegistration({
      deceased: {
        ...buildEventRegistration().deceased!,
        exactDateOfBirthUnknown: true,
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.dobUnknown'], true)
  })

  await t.step('should resolve deceased.age with asOfDateRef', () => {
    const data = buildEventRegistration({
      deceased: {
        ...buildEventRegistration().deceased!,
        ageOfIndividualInYears: 74,
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.age'], {
      age: 74,
      asOfDateRef: 'eventDetails.date',
    })
  })

  await t.step('should resolve deceased.nationality', () => {
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.nationality'], 'FAR')
  })

  await t.step('should resolve deceased.idType from questionnaire', () => {
    const data = buildEventRegistration({
      questionnaire: [
        {
          fieldId: 'death.deceased.deceased-view-group.deceasedIdType',
          value: 'NATIONAL_ID',
        },
      ],
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.idType'], 'NATIONAL_ID')
  })

  await t.step('should resolve deceased.nid', () => {
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.nid'], 'DEC123456')
  })

  await t.step('should resolve deceased.passport', () => {
    const data = buildEventRegistration({
      deceased: {
        ...buildEventRegistration().deceased!,
        identifier: [{ type: 'PASSPORT', id: 'P123456' }],
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.passport'], 'P123456')
  })

  await t.step('should resolve deceased.brn', () => {
    const data = buildEventRegistration({
      deceased: {
        ...buildEventRegistration().deceased!,
        identifier: [{ type: 'BIRTH_REGISTRATION_NUMBER', id: 'B123456' }],
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.brn'], 'B123456')
  })

  await t.step('should resolve deceased.maritalStatus', () => {
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['deceased.maritalStatus'],
      'MARRIED'
    )
  })

  await t.step('should resolve deceased.numberOfDependants', () => {
    const data = buildEventRegistration({
      questionnaire: [
        {
          fieldId: 'death.deceased.deceased-view-group.numberOfDependants',
          value: '3',
        },
      ],
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.numberOfDependants'], 3)
  })

  await t.step('should resolve deceased.address', () => {
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.address']?.country, 'FAR')
    assertEquals(
      declareAction?.declaration['deceased.address']?.administrativeArea,
      'District1'
    )
  })

  await t.step('should resolve deceased.verified from questionnaire', () => {
    const data = buildEventRegistration({
      questionnaire: [
        {
          fieldId: 'death.deceased.deceased-view-group.verified',
          value: 'verified',
        },
      ],
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.verified'], 'verified')
  })
})

Deno.test('deathResolver - eventDetails fields', async (t) => {
  await t.step(
    'should resolve eventDetails.date from deceased.deceased.deathDate',
    () => {
      const data = buildEventRegistration()
      const result = transform(data, deathResolver, 'death')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(
        declareAction?.declaration['eventDetails.date'],
        '2024-01-01'
      )
    }
  )

  await t.step(
    'should resolve eventDetails.date from deathDate fallback',
    () => {
      const data = buildEventRegistration({
        deceased: {
          ...buildEventRegistration().deceased!,
          deceased: undefined,
        },
      })
      const result = transform(data, deathResolver, 'death')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(
        declareAction?.declaration['eventDetails.date'],
        '2024-01-01'
      )
    }
  )

  await t.step('should resolve eventDetails.description', () => {
    const data = buildEventRegistration({
      deathDescription: 'Natural causes',
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['eventDetails.description'],
      'Natural causes'
    )
  })

  await t.step('should resolve eventDetails.reasonForLateRegistration', () => {
    const data = buildEventRegistration({
      questionnaire: [
        {
          fieldId:
            'death.deathEvent.death-event-details.reasonForLateRegistration',
          value: 'Travel delays',
        },
      ],
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['eventDetails.reasonForLateRegistration'],
      'Travel delays'
    )
  })

  await t.step('should resolve eventDetails.causeOfDeathEstablished', () => {
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['eventDetails.causeOfDeathEstablished'],
      true
    )
  })

  await t.step('should resolve eventDetails.sourceCauseDeath', () => {
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['eventDetails.sourceCauseDeath'],
      'PHYSICIAN'
    )
  })

  await t.step('should resolve eventDetails.mannerOfDeath', () => {
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['eventDetails.mannerOfDeath'],
      'MANNER_NATURAL'
    )
  })

  await t.step('should map ACCIDENT to MANNER_ACCIDENT', () => {
    const data = buildEventRegistration({
      mannerOfDeath: 'ACCIDENT',
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['eventDetails.mannerOfDeath'],
      'MANNER_ACCIDENT'
    )
  })

  await t.step('should resolve eventDetails.placeOfDeath', () => {
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['eventDetails.placeOfDeath'],
      'HEALTH_FACILITY'
    )
  })

  await t.step(
    'should resolve eventDetails.deathLocation for HEALTH_FACILITY',
    () => {
      const data = buildEventRegistration()
      const result = transform(data, deathResolver, 'death')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(
        declareAction?.declaration['eventDetails.deathLocation'],
        'location-id'
      )
    }
  )

  await t.step(
    'should resolve eventDetails.deathLocationOther for OTHER',
    () => {
      const data = buildEventRegistration({
        eventLocation: {
          id: 'other-location',
          type: 'OTHER',
          address: {
            line: ['999 Death St'],
            district: 'DistrictX',
            state: 'StateX',
            country: 'FAR',
          },
        },
      })
      const result = transform(data, deathResolver, 'death')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(
        declareAction?.declaration['eventDetails.deathLocationOther']?.country,
        'FAR'
      )
    }
  )
})

Deno.test('deathResolver - informant fields', async (t) => {
  await t.step(
    'should resolve informant.addressSameAs when addresses match',
    () => {
      const sharedAddress = {
        type: 'PRIMARY_ADDRESS',
        line: ['Same St'],
        district: 'District1',
        state: 'State1',
        country: 'FAR',
      }
      const data = buildEventRegistration({
        deceased: {
          ...buildEventRegistration().deceased!,
          address: [sharedAddress],
        },
        informant: {
          ...buildEventRegistration().informant!,
          address: [sharedAddress],
        },
      })
      const result = transform(data, deathResolver, 'death')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(declareAction?.declaration['informant.addressSameAs'], 'YES')
    }
  )

  await t.step(
    'should resolve informant.addressSameAs when addresses differ',
    () => {
      const data = buildEventRegistration()
      const result = transform(data, deathResolver, 'death')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(declareAction?.declaration['informant.addressSameAs'], 'NO')
    }
  )

  await t.step('should resolve informant.idType from questionnaire', () => {
    const data = buildEventRegistration({
      questionnaire: [
        {
          fieldId: 'death.informant.informant-view-group.informantIdType',
          value: 'PASSPORT',
        },
      ],
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.idType'], 'PASSPORT')
  })

  await t.step('should resolve informant.dob for non-special informant', () => {
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.dob'], '1980-01-01')
  })

  await t.step('should not resolve informant.dob for SPOUSE', () => {
    const data = buildEventRegistration({
      informant: {
        ...buildEventRegistration().informant!,
        relationship: 'SPOUSE',
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.dob'], undefined)
  })

  await t.step(
    'should resolve informant.address for non-special informant',
    () => {
      const data = buildEventRegistration()
      const result = transform(data, deathResolver, 'death')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(
        declareAction?.declaration['informant.address']?.country,
        'FAR'
      )
    }
  )

  await t.step(
    'should resolve informant.phoneNo with country code stripped',
    () => {
      const data = buildEventRegistration()
      const result = transform(data, deathResolver, 'death')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(
        declareAction?.declaration['informant.phoneNo'],
        '0987654321'
      )
    }
  )

  await t.step('should resolve informant.email', () => {
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['informant.email'],
      'contact@example.com'
    )
  })

  await t.step('should resolve informant.relation', () => {
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.relation'], 'SON')
  })

  await t.step('should resolve informant.other.relation', () => {
    const data = buildEventRegistration({
      informant: {
        ...buildEventRegistration().informant!,
        relationship: 'OTHER',
        otherRelationship: 'Caregiver',
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['informant.other.relation'],
      'Caregiver'
    )
  })

  await t.step(
    'should resolve informant.name for non-special informant',
    () => {
      const data = buildEventRegistration()
      const result = transform(data, deathResolver, 'death')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(declareAction?.declaration['informant.name'], {
        firstname: 'Jane',
        middleName: undefined,
        surname: 'Doe',
      })
    }
  )

  await t.step('should resolve informant.dobUnknown', () => {
    const data = buildEventRegistration({
      informant: {
        ...buildEventRegistration().informant!,
        birthDate: undefined,
        exactDateOfBirthUnknown: true,
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.dobUnknown'], true)
  })

  await t.step('should resolve informant.age', () => {
    const data = buildEventRegistration({
      informant: {
        ...buildEventRegistration().informant!,
        birthDate: undefined,
        ageOfIndividualInYears: 44,
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.age'], {
      age: 44,
      asOfDateRef: 'eventDetails.date',
    })
  })

  await t.step('should resolve informant.nationality', () => {
    const data = buildEventRegistration({
      informant: {
        ...buildEventRegistration().informant!,
        nationality: ['USA'],
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.nationality'], 'USA')
  })

  await t.step('should resolve informant.brn', () => {
    const data = buildEventRegistration({
      informant: {
        ...buildEventRegistration().informant!,
        identifier: [{ type: 'BIRTH_REGISTRATION_NUMBER', id: 'BRN123' }],
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.brn'], 'BRN123')
  })

  await t.step('should resolve informant.nid', () => {
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.nid'], 'INF789')
  })

  await t.step('should resolve informant.passport', () => {
    const data = buildEventRegistration({
      informant: {
        ...buildEventRegistration().informant!,
        identifier: [{ type: 'PASSPORT', id: 'P789' }],
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.passport'], 'P789')
  })

  await t.step('should resolve informant.verified from questionnaire', () => {
    const data = buildEventRegistration({
      questionnaire: [
        {
          fieldId: 'death.informant.informant-view-group.verified',
          value: 'authenticated',
        },
      ],
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['informant.verified'],
      'authenticated'
    )
  })
})

Deno.test('deathResolver - spouse fields', async (t) => {
  await t.step('should resolve spouse.detailsNotAvailable when false', () => {
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(
      declareAction?.declaration['spouse.detailsNotAvailable'],
      false
    )
  })

  await t.step('should resolve spouse.detailsNotAvailable when true', () => {
    const data = buildEventRegistration({
      spouse: {
        ...buildEventRegistration().spouse!,
        detailsExist: false,
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.detailsNotAvailable'], true)
  })

  await t.step('should resolve spouse.reason', () => {
    const data = buildEventRegistration({
      spouse: {
        ...buildEventRegistration().spouse!,
        reasonNotApplying: 'Divorced',
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.reason'], 'Divorced')
  })

  await t.step('should resolve spouse.name', () => {
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.name'], {
      firstname: 'Mary',
      middleName: undefined,
      surname: 'Smith',
    })
  })

  await t.step('should resolve spouse.dob', () => {
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.dob'], '1952-01-01')
  })

  await t.step('should resolve spouse.dobUnknown', () => {
    const data = buildEventRegistration({
      spouse: {
        ...buildEventRegistration().spouse!,
        exactDateOfBirthUnknown: true,
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.dobUnknown'], true)
  })

  await t.step('should resolve spouse.age', () => {
    const data = buildEventRegistration({
      spouse: {
        ...buildEventRegistration().spouse!,
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
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.nationality'], 'FAR')
  })

  await t.step('should resolve spouse.idType from questionnaire', () => {
    const data = buildEventRegistration({
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
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.nid'], 'SPO456')
  })

  await t.step('should resolve spouse.passport', () => {
    const data = buildEventRegistration({
      spouse: {
        ...buildEventRegistration().spouse!,
        identifier: [{ type: 'PASSPORT', id: 'P456' }],
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.passport'], 'P456')
  })

  await t.step('should resolve spouse.brn', () => {
    const data = buildEventRegistration({
      spouse: {
        ...buildEventRegistration().spouse!,
        identifier: [{ type: 'BIRTH_REGISTRATION_NUMBER', id: 'B456' }],
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.brn'], 'B456')
  })

  await t.step('should resolve spouse.address', () => {
    const data = buildEventRegistration()
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.address']?.country, 'FAR')
  })

  await t.step(
    'should resolve spouse.addressSameAs when addresses match',
    () => {
      const sharedAddress = {
        type: 'PRIMARY_ADDRESS',
        line: ['Same St'],
        district: 'District1',
        state: 'State1',
        country: 'FAR',
      }
      const data = buildEventRegistration({
        deceased: {
          ...buildEventRegistration().deceased!,
          address: [sharedAddress],
        },
        spouse: {
          ...buildEventRegistration().spouse!,
          address: [sharedAddress],
        },
      })
      const result = transform(data, deathResolver, 'death')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(declareAction?.declaration['spouse.addressSameAs'], 'YES')
    }
  )

  await t.step(
    'should resolve spouse.addressSameAs when addresses differ',
    () => {
      const data = buildEventRegistration()
      const result = transform(data, deathResolver, 'death')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(declareAction?.declaration['spouse.addressSameAs'], 'NO')
    }
  )

  await t.step('should resolve spouse.verified from questionnaire', () => {
    const data = buildEventRegistration({
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

Deno.test('deathResolver - documents fields', async (t) => {
  await t.step('should resolve documents.proofOfDeceased', () => {
    const data = buildEventRegistration({
      registration: {
        trackingId: 'DW12345',
        attachments: [
          {
            uri: '/path/to/doc1.pdf',
            contentType: 'application/pdf',
            type: 'DECEASED_ID_PROOF',
            subject: 'DECEASED_ID_PROOF',
          },
        ],
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['documents.proofOfDeceased'], [
      {
        path: '/path/to/doc1.pdf',
        originalFilename: '/path/to/doc1.pdf',
        type: 'application/pdf',
        option: 'DECEASED_ID_PROOF',
      },
    ])
  })

  await t.step('should resolve documents.proofOfDeath', () => {
    const data = buildEventRegistration({
      registration: {
        trackingId: 'DW12345',
        attachments: [
          {
            uri: '/path/to/doc2.pdf',
            contentType: 'application/pdf',
            type: 'DECEASED_DEATH_PROOF',
            subject: 'DECEASED_DEATH_PROOF',
          },
        ],
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['documents.proofOfDeath'], [
      {
        path: '/path/to/doc2.pdf',
        originalFilename: '/path/to/doc2.pdf',
        type: 'application/pdf',
        option: 'DECEASED_DEATH_PROOF',
      },
    ])
  })

  await t.step('should resolve documents.proofOfCauseOfDeath', () => {
    const data = buildEventRegistration({
      registration: {
        trackingId: 'DW12345',
        attachments: [
          {
            uri: '/path/to/doc3.pdf',
            contentType: 'application/pdf',
            type: 'DECEASED_DEATH_CAUSE_PROOF',
            subject: 'DECEASED_DEATH_CAUSE_PROOF',
          },
        ],
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['documents.proofOfCauseOfDeath'], [
      {
        path: '/path/to/doc3.pdf',
        originalFilename: '/path/to/doc3.pdf',
        type: 'application/pdf',
        option: 'DECEASED_DEATH_CAUSE_PROOF',
      },
    ])
  })

  await t.step('should resolve documents.proofOfInformant', () => {
    const data = buildEventRegistration({
      registration: {
        trackingId: 'DW12345',
        attachments: [
          {
            uri: '/path/to/doc4.pdf',
            contentType: 'application/pdf',
            type: 'INFORMANT_ID_PROOF',
            subject: 'INFORMANT_ID_PROOF',
          },
        ],
      },
    })
    const result = transform(data, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['documents.proofOfInformant'], [
      {
        path: '/path/to/doc4.pdf',
        originalFilename: '/path/to/doc4.pdf',
        type: 'application/pdf',
        option: 'INFORMANT_ID_PROOF',
      },
    ])
  })

  await t.step(
    'should resolve documents.proofOther combining OTHER and LEGAL_GUARDIAN_PROOF',
    () => {
      const data = buildEventRegistration({
        registration: {
          trackingId: 'DW12345',
          attachments: [
            {
              uri: '/path/to/doc5.pdf',
              contentType: 'application/pdf',
              type: 'OTHER',
              subject: 'OTHER',
            },
            {
              uri: '/path/to/doc6.pdf',
              contentType: 'application/pdf',
              type: 'LEGAL_GUARDIAN_PROOF',
              subject: 'LEGAL_GUARDIAN_PROOF',
            },
          ],
        },
      })
      const result = transform(data, deathResolver, 'death')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(declareAction?.declaration['documents.proofOther'], [
        {
          path: '/path/to/doc5.pdf',
          originalFilename: '/path/to/doc5.pdf',
          type: 'application/pdf',
          option: 'OTHER',
        },
        {
          path: '/path/to/doc6.pdf',
          originalFilename: '/path/to/doc6.pdf',
          type: 'application/pdf',
          option: 'LEGAL_GUARDIAN_PROOF',
        },
      ])
    }
  )
})
