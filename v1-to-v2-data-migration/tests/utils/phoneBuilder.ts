import { COUNTRY_PHONE_CODE } from '../../countryData/addressResolver.ts'

/**
 * Builds a phone number with the country code prefix
 * @param localNumber - The local phone number without country code (e.g., '0987654321')
 * @returns Full phone number with country code (e.g., '+252987654321')
 */
export function buildPhoneNumber(localNumber: string): string {
  // Remove leading zero if present, as international format doesn't use it
  const numberWithoutZero = localNumber.startsWith('0')
    ? localNumber.substring(1)
    : localNumber

  return `${COUNTRY_PHONE_CODE}${numberWithoutZero}`
}

/**
 * Strips the country code from a phone number
 * @param fullNumber - Phone number with country code (e.g., '+252987654321')
 * @returns Local phone number with leading zero (e.g., '0987654321')
 */
export function stripCountryCode(fullNumber: string): string {
  if (!fullNumber.startsWith(COUNTRY_PHONE_CODE)) {
    return fullNumber
  }

  const localPart = fullNumber.substring(COUNTRY_PHONE_CODE.length)
  // Add leading zero if not present
  return localPart.startsWith('0') ? localPart : `0${localPart}`
}

/**
 * Gets the current country phone code
 * @returns Country phone code (e.g., '+252')
 */
export function getCountryPhoneCode(): string {
  return COUNTRY_PHONE_CODE
}
