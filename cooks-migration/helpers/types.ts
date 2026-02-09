import { Country } from './addressConfig.ts'

export type LocationMap = {
  id: string
  name: string
  map: string | null
  facilityCode: string | null
  country: Country | null
  intlTown: string | null
}

export type EventType =
  | 'birth'
  | 'death'
  | 'marriage-registration'
  | 'marriage-licence'
  | 'divorce'
  | 'name-change'
  | 'adoption'

export type ActionType = 'CREATE' | 'REGISTER'

export type Gender = 'male' | 'female' | 'unknown'

export type Action = {
  id: string
  type: ActionType
  transactionId: string
  createdAt: string
  createdBy: string
  createdByUserType: 'user'
  createdByRole: string
  createdAtLocation: string
  updatedAtLocation: string
  status: 'Accepted' | 'Rejected' | 'Pending'
  declaration: Record<string, unknown>
  registrationNumber?: string
}

export type CrvsEvent = {
  id: string
  type: EventType
  createdAt: string
  updatedAt: string
  updatedAtLocation: string
  trackingId: string
  actions: Array<Action>
}

export type Name = { firstname: string; surname: string }
