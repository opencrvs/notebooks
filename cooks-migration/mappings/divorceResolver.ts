import { CsvFields, MarriageCsvRecord } from '../helpers/csvTypes.ts'
import { DivorceResolver, DivorceMetaData } from '../helpers/divorceTypes.ts'
import { LocationMap } from '../helpers/types.ts'
import {
  getLocationCode,
  getLocationFromRegNum,
  resolveAddress,
  toCrvsDate,
  toISODate,
  toName
} from '../helpers/resolverHelpers.ts'
import { getBrideStatus, getGroomStatus } from './marriageResolver.ts'

// Note: Divorce mappings use the same legacy field names as marriage registration
export const divorceResolver: DivorceResolver = {
  'applicationDetails.typeOfApplication': '',
  'applicationDetails.applicantParty': '',
  'marriageDetails.marriageRegistrationNumber': '', // This is search
  'marriageDetails.dateOfMarriage': (data: MarriageCsvRecord) =>
    toCrvsDate(data.MARRIAGE_DATE),
  'marriageDetails.placeOfMarriage': (data: MarriageCsvRecord) =>
    data.MARRIAGE_PLACE,
  'marriageDetails.bridegroomGivenNames': (data: MarriageCsvRecord) =>
    toName(data.GROOM_FIRSTNAME, data.GROOM_LASTNAME),
  'marriageDetails.bridegroomDob': (data: MarriageCsvRecord) =>
    toCrvsDate(data.GROOM_DOB),
  'marriageDetails.bridegroompob': (data: MarriageCsvRecord) =>
    data.GROOM_BIRTHPLACE,
  'marriageDetails.bridegroomOccupation': (data: MarriageCsvRecord) =>
    data.GROOM_OCCUPATION,
  'marriageDetails.bridegroomConjugalStatus': (data: MarriageCsvRecord) =>
    getGroomStatus(data.GROOM_STATUS),
  'marriageDetails.bridegroomDecreeAbsoluteDate': '', // Could be in Extra_info
  'marriageDetails.bridegroomFormerWifeDeathDate': (data: MarriageCsvRecord) =>
    toCrvsDate(data.GROOM_DOD_WIDOW),
  'marriageDetails.residence': (
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
  'marriageDetails.brideDecreeAbsoluteDate': '',
  'marriageDetails.brideFormerHusbandDeathDate': (data: MarriageCsvRecord) =>
    toCrvsDate(data.BRIDE_DOD_WIDOWER),
  'marriageDetails.brideResidence': (
    data: MarriageCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) => resolveAddress(data.BRIDE_RESIDENCE, locationMap),
  'divorceOrderDetails.orderNumber': '',
  'divorceOrderDetails.issuingAuthority': (_: MarriageCsvRecord) =>
    'HIGH_COURT_COOK_ISLANDS',
  'divorceOrderDetails.orderDate': '' //Could be in date of decree in extra info
}

export const divorceMetaData: DivorceMetaData = {
  registrationDate: (data: MarriageCsvRecord) => toISODate(data.MARRIAGE_DATE),
  locationCode: (
    data: MarriageCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) =>
    getLocationCode(data.MARRIAGE_PLACE, locationMap) ||
    getLocationFromRegNum(data.NOTICE_NUMBER)
}
