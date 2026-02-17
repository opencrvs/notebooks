import { Address } from './addressConfig.ts'
import { CsvFields, MarriageCsvRecord } from './csvTypes.ts'
import { CrvsDate, LocationMap, Name } from './types.ts'

export type DivorceResolverFunction<T> =
  | ((data: MarriageCsvRecord) => T)
  | ((data: MarriageCsvRecord, all: CsvFields) => T)
  | ((data: MarriageCsvRecord, all: CsvFields, locationMap: LocationMap[]) => T)

export type DivorceResolver = {
  'informant.contact': string
  'reason.option': string
  'reason.other': string
  'applicationDetails.typeOfApplication': string
  'applicationDetails.applicantParty': string
  'marriageDetails.marriageRegistrationNumber': DivorceResolverFunction<string>
  'marriageDetails.dateOfMarriage': DivorceResolverFunction<CrvsDate>
  'marriageDetails.placeOfMarriage': DivorceResolverFunction<string>
  'marriageDetails.bridegroomGivenNames': DivorceResolverFunction<Name>
  'marriageDetails.bridegroomDob': DivorceResolverFunction<CrvsDate>
  'marriageDetails.bridegroompob': DivorceResolverFunction<string>
  'marriageDetails.bridegroomOccupation': DivorceResolverFunction<string>
  'marriageDetails.bridegroomConjugalStatus': DivorceResolverFunction<string>
  'marriageDetails.bridegroomDecreeAbsoluteDate': string
  'marriageDetails.bridegroomFormerWifeDeathDate': DivorceResolverFunction<CrvsDate>
  'marriageDetails.residence': DivorceResolverFunction<Address | undefined>
  'marriageDetails.brideName': DivorceResolverFunction<Name>
  'marriageDetails.brideDob': DivorceResolverFunction<CrvsDate>
  'marriageDetails.bridePlaceOfBirth': DivorceResolverFunction<string>
  'marriageDetails.brideOccupation': DivorceResolverFunction<string>
  'marriageDetails.brideConjugalStatus': DivorceResolverFunction<string>
  'marriageDetails.brideDecreeAbsoluteDate': string
  'marriageDetails.brideFormerHusbandDeathDate': DivorceResolverFunction<CrvsDate>
  'marriageDetails.brideResidence': DivorceResolverFunction<Address | undefined>
  'divorceOrderDetails.orderNumber': string
  'divorceOrderDetails.issuingAuthority': string
  'divorceOrderDetails.orderDate': string
}

export type DivorceMetaData = {
  registrationDate: DivorceResolverFunction<string>
  registrar: DivorceResolverFunction<string>
  locationCode: DivorceResolverFunction<string | null>
}
