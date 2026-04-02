import { AdminStructure, Facility } from '../types/staticTypes.ts'
import { createDeclaration, EventType } from './declarationBuilder.ts'
import { createEvent } from './eventBuilder.ts'
import { faker } from '@faker-js/faker'
import eventDescription from '../formData/eventDescription.json' with { type: 'json' }

const EVENT_TYPES = Object.keys(eventDescription) as EventType[]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomAlphaNumeric(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}

function buildTrackingId(
  eventType: EventType,
  sequentialNumber: number
): string {
  const prefix = eventType.slice(0, 2).toUpperCase()
  const hex = sequentialNumber.toString(16).toUpperCase().padStart(7, '0')
  return `${prefix}${hex}`
}

function buildRegistrationNumber(
  eventType: EventType,
  sequentialNumber: number
): string {
  const prefix = eventType.slice(0, 2).toUpperCase()
  const random = randomAlphaNumeric(4)
  const seq = String(sequentialNumber).padStart(7, '0')
  return `${prefix}-${random}-${seq}`
}

export const createBulkEvents = (
  adminStructure: AdminStructure[],
  facilities: Facility[],
  crvsOffices: Facility[],
  numberToGenerate: number,
  startFrom: number,
  user: string,
  role: string
) => {
  const events = []

  for (let i = 0; i < numberToGenerate; i++) {
    const sequentialNumber = startFrom + i
    const eventType = pick(EVENT_TYPES)
    const trackingId = buildTrackingId(eventType, sequentialNumber)
    const registrationNumber = buildRegistrationNumber(
      eventType,
      sequentialNumber
    )
    const location = pick(crvsOffices)
    const date = faker.date.past({ years: 5 }).toISOString()

    const declaration = createDeclaration(eventType, adminStructure, facilities)
    const event = createEvent(
      declaration,
      eventType,
      date,
      user,
      role,
      location,
      trackingId,
      registrationNumber
    )

    events.push(event)
  }

  return events
}
