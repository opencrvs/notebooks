import { v4 as uuidv4 } from 'npm:uuid'
import { ActionType, CrvsEvent, EventType } from './types.ts'
import { deterministicUuid, hashToTrackingId } from './generators.ts'

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
  id: uuidv4(), //deterministicUuid(trackingId),
  type: eventType,
  createdAt: date,
  updatedAt: date,
  updatedAtLocation: location, // Need location Id
  trackingId: hashToTrackingId(trackingId),
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
      id: uuidv4(),
      transactionId: uuidv4(),
    },
    {
      id: uuidv4(),
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
