import { CsvFields, MarriageCsvRecord } from '../helpers/csvTypes.ts'
import {
  BrideConjugalStatus,
  GroomConjugalStatus,
  MarriageMetaData,
  MarriageResolver
} from '../helpers/marriageTypes.ts'
import { CrvsDate, LocationMap } from '../helpers/types.ts'
import {
  getLocationCode,
  getLocationFromRegNum,
  resolveAddress,
  toCrvsDate,
  toISODate,
  toName
} from '../helpers/resolverHelpers.ts'
import { decreeMap } from '../lookupMappings/marriage/decree.ts'
import { denominationMap } from '../lookupMappings/marriage/denominations.ts'

export const getBrideStatus = (
  status: string
): BrideConjugalStatus | undefined =>
  status === 'SEPARATED'
    ? 'DIVORCED'
    : (
        {
          S: 'SPINSTER',
          D: 'DIVORCED',
          W: 'WIDOW'
        } as Record<string, BrideConjugalStatus>
      )[status[0]]

export const getGroomStatus = (
  status: string
): GroomConjugalStatus | undefined =>
  status === 'S' || status === 'SINGLE'
    ? 'BACHELOR'
    : (
        {
          B: 'BACHELOR',
          D: 'DIVORCED',
          W: 'WIDOWER'
        } as Record<string, GroomConjugalStatus>
      )[status[0]]

export const getDateOfDecree = (data: string): CrvsDate | undefined =>
  decreeMap[data]

export const marriageResolver: MarriageResolver = {
  'marriageDetails.licenceNumber': '',
  'marriageDetails.expiryDate': (data: MarriageCsvRecord) =>
    toCrvsDate(data.LICENCE_EXPIRY_DATE),
  'marriageDetails.dateOfMarriage': (data: MarriageCsvRecord) =>
    toCrvsDate(data.MARRIAGE_DATE),
  'marriageDetails.address': (
    data: MarriageCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) => resolveAddress(data.MARRIAGE_PLACE, locationMap),
  'marriageDetails.venueName': (data: MarriageCsvRecord) => data.CHURCH_NAME,
  'marriageDetails.officiantType': (data: MarriageCsvRecord) =>
    denominationMap[data.DENOMINATION] || 'MARRIAGE_CELEBRANT',
  'marriageDetails.officiantFullName': (data: MarriageCsvRecord) =>
    data.PASTOR_NAME || 'Legacy record',
  'marriageDetails.officiantAffiliation': (data: MarriageCsvRecord) =>
    data.DENOMINATION,
  'marriageDetails.bridegroomName': (data: MarriageCsvRecord) =>
    toName(data.GROOM_FIRSTNAME, data.GROOM_LASTNAME),
  'marriageDetails.bridegroomDob': (data: MarriageCsvRecord) =>
    toCrvsDate(data.GROOM_DOB),
  'marriageDetails.bridegroomPlaceOfBirth': (data: MarriageCsvRecord) =>
    data.GROOM_BIRTHPLACE,
  'marriageDetails.bridegroomOccupation': (data: MarriageCsvRecord) =>
    data.GROOM_OCCUPATION,
  'marriageDetails.bridegroomConjugalStatus': (data: MarriageCsvRecord) =>
    getGroomStatus(data.GROOM_STATUS),
  'marriageDetails.bridegroomDateOfDecreeAbsolute': (data: MarriageCsvRecord) =>
    getDateOfDecree(data.Extra_info),
  'marriageDetails.bridegroomDateOfDeathFormerWife': (
    data: MarriageCsvRecord
  ) => toCrvsDate(data.GROOM_DOD_WIDOW),
  'marriageDetails.bridegroomAddress': (
    data: MarriageCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) => resolveAddress(data.GROOM_RESIDENCE, locationMap),
  'marriageDetails.brideName': (data: MarriageCsvRecord) =>
    toName(data.BRIDE_FIRSTNAME, data.BRIDE_LASTNAME),
  'marriageDetails.brideDob': (data: MarriageCsvRecord) =>
    toCrvsDate(data.BRIDE_DOB),
  'marriageDetails.bridePlaceOfBirth': (data: MarriageCsvRecord) =>
    data.BRIDE_BIRTHPLACE,
  'marriageDetails.brideOccupation': (data: MarriageCsvRecord) =>
    data.BRIDE_OCCUPATION,
  'marriageDetails.brideConjugalStatus': (data: MarriageCsvRecord) =>
    getBrideStatus(data.BRIDE_STATUS),
  'marriageDetails.brideDateOfDecreeAbsolute': (data: MarriageCsvRecord) =>
    getDateOfDecree(data.Extra_info),
  'marriageDetails.brideDateOfDeathFormerHusband': (data: MarriageCsvRecord) =>
    toCrvsDate(data.BRIDE_DOD_WIDOWER),
  'marriageDetails.brideAddress': (
    data: MarriageCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) => resolveAddress(data.BRIDE_RESIDENCE, locationMap),
  'informantDetails.informantType': '',
  'informantDetails.relationshipToOfficiantOrCouple': '',
  'informantDetails.name': '',
  'informantDetails.phoneNumber': '',
  'informantDetails.email': ''
}

export const marriageMetaData: MarriageMetaData = {
  registrationDate: (data: MarriageCsvRecord) => toISODate(data.MARRIAGE_DATE),
  locationCode: (
    data: MarriageCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) =>
    getLocationCode(data.MARRIAGE_PLACE, locationMap) ||
    getLocationFromRegNum(data.NOTICE_NUMBER)
}
