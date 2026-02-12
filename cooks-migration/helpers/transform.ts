import { v4 as uuidv4, v5 as uuidv5 } from 'npm:uuid'
import { ActionType, CrvsEvent, EventType } from './types.ts'
import { deterministicHash, UUID_NAMESPACE } from './generators.ts'

export const transform = (
  declaration: Record<string, unknown>,
  eventType: EventType,
  date: string,
  user: string,
  role: string,
  location: string,
  trackingId: string,
  registrationNumber: string,
): CrvsEvent => ({
  id: uuidv5(registrationNumber, UUID_NAMESPACE),
  type: eventType,
  createdAt: date,
  updatedAt: date,
  updatedAtLocation: location, // Need location Id
  trackingId: deterministicHash(trackingId, 6),
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
      transactionId: uuidv4(),
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
      registrationNumber: registrationNumber,
    },
  ],
})
