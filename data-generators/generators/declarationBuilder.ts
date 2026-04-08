import { faker } from '@faker-js/faker'
import { AdminStructure, COUNTRIES, Facility } from '../types/staticTypes.ts'
import eventDescription from '../types/eventDescription_generated.json' with { type: 'json' }

export type EventField = {
  id: string
  type: string
  options?: string[]
  nameFields?: string[]
  streetAddressFields?: {
    id: string
    type: string
    addressType: string
  }[]
  defaultCountry?: string
  asOfDateRef?: string
}
export type EventType = keyof typeof eventDescription

const eventFieldMap: Record<EventType, EventField[]> = eventDescription

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateValueForField(
  field: EventField,
  adminStructure: AdminStructure[],
  facilities: Facility[]
): unknown {
  switch (field.type) {
    case 'NAME': {
      return Object.fromEntries(
        (field.nameFields ?? []).map((key) => [key, faker.person.firstName()])
      )
    }

    case 'DATE':
      return faker.date.past({ years: 50 }).toISOString().slice(0, 10)

    case 'SELECT':
    case 'RADIO_GROUP':
      return field.options ? pick(field.options) : undefined

    case 'CHECKBOX':
      return false

    case 'FACILITY':
      return pick(facilities)

    case 'ADDRESS': {
      const addressType = Math.random() < 0.5 ? 'DOMESTIC' : 'INTERNATIONAL'
      const streetFields = (field.streetAddressFields ?? []).filter(
        (sf) => sf.addressType === addressType
      )
      const domesticCountry = field.defaultCountry ?? 'FAR'
      const country =
        addressType === 'DOMESTIC'
          ? domesticCountry
          : pick(COUNTRIES.filter((c) => c !== domesticCountry))
      return {
        addressType,
        country,
        administrativeArea: pick(adminStructure),
        streetLevelDetails: Object.fromEntries(
          streetFields.map((sf) => [sf.id, faker.location.city()])
        )
      }
    }

    case 'COUNTRY':
      return field.defaultCountry ?? 'FAR'

    case 'PHONE':
      return faker.phone.number({ style: 'international' })

    case 'EMAIL':
      return faker.internet.email()

    case 'NUMBER':
      return faker.number.int({ min: 1, max: 10 })

    case 'AGE':
      return {
        age: faker.number.int({ min: 18, max: 80 }),
        asOfDateRef: field.asOfDateRef ?? ''
      }

    case 'ID':
      return faker.string.numeric(7)

    case 'TEXT':
      return faker.lorem.words(3)

    case 'TEXTAREA':
      return faker.lorem.sentence()

    case 'TIME':
      return faker.date.recent().toTimeString().slice(0, 5)

    default:
      return undefined
  }
}

export function createDeclaration(
  eventType: EventType,
  adminStructure: AdminStructure[],
  facilities: Facility[]
): Record<string, unknown> {
  const fields = eventFieldMap[eventType]
  const declaration: Record<string, unknown> = {}

  for (const field of fields) {
    const value = generateValueForField(field, adminStructure, facilities)
    if (value !== undefined) {
      declaration[field.id] = value
    }
  }

  return declaration
}
