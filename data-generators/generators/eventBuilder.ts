import { v4 as uuidv4 } from 'npm:uuid'

export const trackingIdMap: Record<string, string> = {}

export const createEvent = (
  declaration: Record<string, unknown>,
  eventType: string,
  date: string,
  user: string,
  role: string,
  location: string,
  trackingId: string,
  registrationNumber: string
) => {
  const printDate = new Date(date)
  printDate.setHours(23)

  return {
    id: uuidv4(),
    type: eventType,
    createdAt: date,
    updatedAt: date,
    updatedAtLocation: location, // Need location Id
    trackingId,
    actions: [
      {
        type: 'CREATE',
        createdAt: date,
        createdBy: user,
        createdByUserType: 'user' as const,
        createdByRole: role, // Do I use a static role?
        createdAtLocation: location,
        updatedAtLocation: location,
        status: 'Accepted',
        declaration: {},
        id: uuidv4(),
        transactionId: uuidv4()
      },
      {
        id: uuidv4(),
        type: 'REGISTER',
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
        id: uuidv4(),
        type: 'PRINT_CERTIFICATE',
        transactionId: uuidv4(),
        createdAt: printDate.toISOString(),
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
