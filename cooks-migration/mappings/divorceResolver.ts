import { CsvFields, MarriageCsvRecord } from '../helpers/csvTypes.ts'
import {
  DivorceResolver,
  DivorceMetaData,
  ApplicantType
} from '../helpers/divorceTypes.ts'
import { LocationMap } from '../helpers/types.ts'
import {
  getLocationCode,
  getLocationFromRegNum,
  resolveAddress,
  toCrvsDate,
  toISODate,
  toLegacy,
  toName,
  toTitleCase
} from '../helpers/resolverHelpers.ts'
import {
  getBrideStatus,
  getDateOfDecree,
  getGroomStatus
} from './marriageResolver.ts'

export const divorceResolver: DivorceResolver = {
  'applicationDetails.typeOfApplication': (_: MarriageCsvRecord) =>
    'JOINT' as ApplicantType,
  'applicationDetails.applicantParty': '',
  'marriageDetails.marriageRegistrationNumber': (data: MarriageCsvRecord) =>
    toLegacy(data.NOTICE_NUMBER, 'marriage-registration'),
  'marriageDetails.dateOfMarriage': (data: MarriageCsvRecord) =>
    toCrvsDate(data.MARRIAGE_DATE),
  'marriageDetails.placeOfMarriage': (data: MarriageCsvRecord) =>
    toTitleCase(data.MARRIAGE_PLACE),
  'marriageDetails.bridegroomGivenNames': (data: MarriageCsvRecord) =>
    toName(data.GROOM_FIRSTNAME, data.GROOM_LASTNAME),
  'marriageDetails.bridegroomDob': (data: MarriageCsvRecord) =>
    toCrvsDate(data.GROOM_DOB),
  'marriageDetails.bridegroompob': (data: MarriageCsvRecord) =>
    toTitleCase(data.GROOM_BIRTHPLACE),
  'marriageDetails.bridegroomOccupation': (data: MarriageCsvRecord) =>
    toTitleCase(data.GROOM_OCCUPATION),
  'marriageDetails.bridegroomConjugalStatus': (data: MarriageCsvRecord) =>
    getGroomStatus(data.GROOM_STATUS),
  'marriageDetails.bridegroomDecreeAbsoluteDate': (data: MarriageCsvRecord) =>
    getDateOfDecree(data.Extra_info),
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
    toTitleCase(data.BRIDE_BIRTHPLACE),
  'marriageDetails.brideOccupation': (data: MarriageCsvRecord) =>
    data.BRIDE_OCCUPATION,
  'marriageDetails.brideConjugalStatus': (data: MarriageCsvRecord) =>
    getBrideStatus(data.BRIDE_STATUS),
  'marriageDetails.brideDecreeAbsoluteDate': (data: MarriageCsvRecord) =>
    getDateOfDecree(data.Extra_info),
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
  'divorceOrderDetails.orderDate': (data: MarriageCsvRecord) =>
    getDateOfDecree(data.Extra_info)
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
