import { v4 as uuidv4, v5 as uuidv5 } from 'npm:uuid'
import { ActionType, CrvsEvent, EventType } from './types.ts'
import { deterministicHash, UUID_NAMESPACE } from './generators.ts'

export const trackingIdMap: Record<string, string> = {}

export const transform = (
  declaration: Record<string, unknown>,
  eventType: EventType,
  date: string,
  user: string,
  role: string,
  location: string,
  trackingId: string,
  registrationNumber: string
): CrvsEvent => {
  const printDate = new Date(date)
  printDate.setHours(23)

  const id = uuidv5(registrationNumber, UUID_NAMESPACE)
  const tracking = trackingIdMap[id] || deterministicHash(trackingId, 6)

  return {
    id: id,
    type: eventType,
    createdAt: date,
    updatedAt: date,
    updatedAtLocation: location, // Need location Id
    trackingId: tracking,
    actions: [
      {
        type: 'CREATE' as ActionType,
        createdAt: date,
        createdBy: user,
        createdByUserType: 'user' as const,
        createdByRole: role, // Do I use a static role?
        createdAtLocation: location,
        updatedAtLocation: location,
        status: 'Accepted',
        declaration: {},
        id: uuidv5(registrationNumber + 'CREATE', UUID_NAMESPACE),
        transactionId: uuidv4()
      },
      {
        id: uuidv5(registrationNumber + 'REGISTER', UUID_NAMESPACE),
        type: 'REGISTER' as ActionType,
        transactionId: uuidv4(),
        createdAt: date,
        createdBy: user,
        createdByUserType: 'user' as const,
        createdByRole: role,
        createdAtLocation: location,
        updatedAtLocation: location,
        status: 'Accepted',
        declaration,
        registrationNumber
      },
      {
        id: uuidv5(registrationNumber + 'PRINT_CERTIFICATE', UUID_NAMESPACE),
        type: 'PRINT_CERTIFICATE' as ActionType,
        transactionId: uuidv4(),
        createdAt: printDate.toISOString(), // Set the time to 11:00 PM to ensure that the certificate is printed on the same day as registration
        createdBy: user,
        createdByUserType: 'user' as const,
        createdByRole: role,
        createdAtLocation: location,
        updatedAtLocation: location,
        status: 'Accepted',
        declaration: {}
      }
    ]
  }
}
