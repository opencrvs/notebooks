import { EventType } from './types.ts'
import { createHash } from 'node:crypto'

export const UUID_NAMESPACE = '8f7491c3-fa99-42f6-9590-b9da188d6c11'

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

const usedTrackingIds = new Set<string>()

// export function deterministicHash(input: string, length: number): string {
//   const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
//   const hash = createHash('sha1').update(input).digest()
//   Hashes++
//   let value = BigInt('0x' + hash.toString('hex'))

//   let result = ''
//   const base = BigInt(36)

//   for (let i = 0; i < length; i++) {
//     result = ALPHABET[Number(value % base)] + result
//     value = value / base
//   }

//   while (usedTrackingIds.has(result)) {
//     Collisions++
//     // console.log(
//     //   `Collision detected for tracking ID: ${result}, input ${input} regenerating...`,
//     // )
//     return deterministicHash(input + input, length)
//   }
//   usedTrackingIds.add(result)
//   return result
// }

export function deterministicHash(input: string, length: number): string {
  const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const hash = createHash('sha1').update(input).digest()
  let value = hash.readUInt32BE(0)

  let result = ''
  for (let i = 0; i < length; i++) {
    result = ALPHABET[value % 36] + result
    value = Math.floor(value / 36)
  }

  while (usedTrackingIds.has(result)) {
    return deterministicHash(input + input, length)
  }
  usedTrackingIds.add(result)
  return result
}

export function generateRegistrationNumber(
  locationCode: string,
  date: string,
  event: EventType,
  seed: string,
): string {
  const year = new Date(date).getUTCFullYear().toString().slice(-2)
  const eventCode = EVENT_TYPE_MAP[event] || 'XX'
  const uniqueId = deterministicHash(seed, 4)
  const islandCode = FALLBACK_ISLAND_PREFIX_MAP[locationCode] || 'XXXX'
  return `${islandCode}${eventCode}${year}${uniqueId}`
}
