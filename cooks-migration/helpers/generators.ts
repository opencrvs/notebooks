import { EventType } from './types.ts'

const TRACKING_ID_LENGTH = 6
const TRACKING_ID_CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function generateTrackingId(): string {
  let result = ''
  for (let i = 0; i < TRACKING_ID_LENGTH; i++) {
    const randomIndex = Math.floor(
      Math.random() * TRACKING_ID_CHARACTERS.length,
    )
    result += TRACKING_ID_CHARACTERS[randomIndex]
  }
  return result
}

let globalCounter = 0

export function hashToTrackingId(input: string): string {
  // Use global counter that increments with each call
  // This guarantees uniqueness while remaining deterministic
  // (same order of processing = same counter values)
  const currentCounter = globalCounter++

  // Encode counter directly in base-36 across all 6 characters
  // This supports up to 36^6 = 2,176,782,336 unique IDs
  let result = ''
  let remainingCounter = currentCounter

  for (let i = 0; i < TRACKING_ID_LENGTH; i++) {
    const charIndex = remainingCounter % TRACKING_ID_CHARACTERS.length
    result = TRACKING_ID_CHARACTERS[charIndex] + result // prepend for natural ordering
    remainingCounter = Math.floor(
      remainingCounter / TRACKING_ID_CHARACTERS.length,
    )
  }

  return result
}

const usedGuids: Array<string> = []

export function deterministicUuid(seed: string): string {
  let hash = 0

  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }

  // Convert hash into 32 hex characters
  let hex = ''
  for (let i = 0; i < 32; i++) {
    const value = (hash + i * 31) & 0xff
    hex += value.toString(16).padStart(2, '0')
  }

  // UUID v4 format
  const result =
    hex.slice(0, 8) +
    '-' +
    hex.slice(8, 12) +
    '-4' +
    hex.slice(13, 16) +
    '-' +
    ((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16) +
    hex.slice(17, 20) +
    '-' +
    hex.slice(20, 32)

  if (usedGuids.includes(result)) {
    throw new Error(`Deterministic UUID collision for seed: ${seed}`)
  }
  usedGuids.push(result)

  return result
}

export const FALLBACK_ISLAND_PREFIX_MAP: Record<string, string> = {
  'COK-001': 'RARO', // Rarotonga
  'COK-002': 'AITU', // Aitutaki
  'COK-003': 'ATIU', // Atiu
  'COK-004': 'MAUK', // Mauke
  'COK-005': 'MITI', // Mitiaro
  'COK-006': 'MANG', // Mangaia
  'COK-007': 'PALM', // Palmerston
  'COK-008': 'MANI', // Manihiki
  'COK-009': 'RAKA', // Rakahanga
  'COK-010': 'PENR', // Penrhyn
  'COK-011': 'PUKA', // Pukapuka
  'COK-012': 'NASS', // Nassau
  'COK-013': 'SUWA', // Suwarrow
  'COK-014': 'TAKU', // Takutea
  'COK-015': 'MANU', // Manuae
}

const EVENT_TYPE_MAP: Record<EventType, string> = {
  birth: 'BR',
  death: 'DR',
  'marriage-licence': 'ML',
  'marriage-registration': 'MR',
  divorce: 'DV',
  adoption: 'AD',
  'name-change': 'DP',
}

export function generateRegistrationNumber(
  locationCode: string,
  date: string,
  event: EventType,
): string {
  const year = new Date(date).getUTCFullYear().toString().slice(-2)
  const eventCode = EVENT_TYPE_MAP[event] || 'XX'
  const uniqueId = generateTrackingId().substring(0, 4)
  const islandCode = FALLBACK_ISLAND_PREFIX_MAP[locationCode] || 'XXXX'
  return `${islandCode}${eventCode}${year}${uniqueId}`
}
