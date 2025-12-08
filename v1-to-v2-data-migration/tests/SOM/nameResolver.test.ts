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

Deno.test('SOM name resolver tests - birth events', async (t) => {
  await t.step('should resolve child.name with all fields', () => {
    const registration = buildBirthEventRegistration({
      child: {
        name: [
          {
            firstNames: 'Ahmed',
            middleName: 'Mohamed',
            familyName: 'Hassan',
          },
        ],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['child.name'], {
      firstname: 'Ahmed',
      middleName: 'Mohamed',
      surname: 'Hassan',
    })
  })

  await t.step('should resolve child.name without middleName', () => {
    const registration = buildBirthEventRegistration({
      child: {
        name: [
          {
            firstNames: 'Fatima',
            familyName: 'Ali',
          },
        ],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['child.name'], {
      firstname: 'Fatima',
      middleName: undefined,
      surname: 'Ali',
    })
  })

  await t.step('should resolve mother.name with all fields', () => {
    const registration = buildBirthEventRegistration({
      mother: {
        name: [
          {
            firstNames: 'Halima',
            middleName: 'Abdi',
            familyName: 'Omar',
          },
        ],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['mother.name'], {
      firstname: 'Halima',
      middleName: 'Abdi',
      surname: 'Omar',
    })
  })

  await t.step('should resolve father.name with all fields', () => {
    const registration = buildBirthEventRegistration({
      father: {
        name: [
          {
            firstNames: 'Ibrahim',
            middleName: 'Yusuf',
            familyName: 'Ahmed',
          },
        ],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['father.name'], {
      firstname: 'Ibrahim',
      middleName: 'Yusuf',
      surname: 'Ahmed',
    })
  })

  await t.step(
    'should resolve informant.name for non-special informant',
    () => {
      const registration = buildBirthEventRegistration({
        informant: {
          relationship: 'GRANDFATHER',
          name: [
            {
              firstNames: 'Osman',
              middleName: 'Ali',
              familyName: 'Hassan',
            },
          ],
        },
      })

      const result = transform(registration, birthResolver, 'birth')
      const declareAction = result.actions.find((a) => a.type === 'DECLARE')

      assertEquals(declareAction?.declaration['informant.name'], {
        firstname: 'Osman',
        middleName: 'Ali',
        surname: 'Hassan',
      })
    }
  )

  await t.step('should return null when name array is undefined', () => {
    const registration = buildBirthEventRegistration({
      child: {
        name: undefined,
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['child.name'], undefined)
  })

  await t.step('should handle empty name array', () => {
    const registration = buildBirthEventRegistration({
      child: {
        name: [],
      },
    })

    const result = transform(registration, birthResolver, 'birth')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['child.name'], undefined)
  })
})

Deno.test('SOM name resolver tests - death events', async (t) => {
  await t.step('should resolve deceased.name with all fields', () => {
    const registration = buildDeathEventRegistration({
      deceased: {
        name: [
          {
            firstNames: 'Abdi',
            middleName: 'Mohamed',
            familyName: 'Aden',
          },
        ],
      },
    })

    const result = transform(registration, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.name'], {
      firstname: 'Abdi',
      middleName: 'Mohamed',
      surname: 'Aden',
    })
  })

  await t.step('should resolve informant.name for non-SPOUSE informant', () => {
    const registration = buildDeathEventRegistration({
      informant: {
        relationship: 'SON',
        name: [
          {
            firstNames: 'Hassan',
            middleName: 'Abdi',
            familyName: 'Aden',
          },
        ],
      },
    })

    const result = transform(registration, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['informant.name'], {
      firstname: 'Hassan',
      middleName: 'Abdi',
      surname: 'Aden',
    })
  })

  await t.step('should resolve spouse.name', () => {
    const registration = buildDeathEventRegistration({
      spouse: {
        name: [
          {
            firstNames: 'Khadija',
            middleName: 'Ali',
            familyName: 'Mohamed',
          },
        ],
      },
    })

    const result = transform(registration, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['spouse.name'], {
      firstname: 'Khadija',
      middleName: 'Ali',
      surname: 'Mohamed',
    })
  })

  await t.step('should handle missing middleName in deceased', () => {
    const registration = buildDeathEventRegistration({
      deceased: {
        name: [
          {
            firstNames: 'Yusuf',
            familyName: 'Ibrahim',
          },
        ],
      },
    })

    const result = transform(registration, deathResolver, 'death')
    const declareAction = result.actions.find((a) => a.type === 'DECLARE')

    assertEquals(declareAction?.declaration['deceased.name'], {
      firstname: 'Yusuf',
      middleName: undefined,
      surname: 'Ibrahim',
    })
  })
})
