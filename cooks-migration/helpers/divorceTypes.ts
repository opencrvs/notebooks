import { Address } from './addressConfig.ts'
import { CsvFields, MarriageCsvRecord } from './csvTypes.ts'
import { BrideConjugalStatus, GroomConjugalStatus } from './marriageTypes.ts'
import { CrvsDate, LocationMap, Name } from './types.ts'

export type DivorceResolverFunction<T> =
  | ((data: MarriageCsvRecord) => T)
  | ((data: MarriageCsvRecord, all: CsvFields) => T)
  | ((data: MarriageCsvRecord, all: CsvFields, locationMap: LocationMap[]) => T)

export type DivorceResolver = {
  'applicationDetails.typeOfApplication': string
  'applicationDetails.applicantParty': string
  'marriageDetails.marriageRegistrationNumber': string
  'marriageDetails.dateOfMarriage': DivorceResolverFunction<CrvsDate>
  'marriageDetails.placeOfMarriage': DivorceResolverFunction<string>
  'marriageDetails.bridegroomGivenNames': DivorceResolverFunction<Name>
  'marriageDetails.bridegroomDob': DivorceResolverFunction<CrvsDate>
  'marriageDetails.bridegroompob': DivorceResolverFunction<string>
  'marriageDetails.bridegroomOccupation': DivorceResolverFunction<string>
  'marriageDetails.bridegroomConjugalStatus': DivorceResolverFunction<
    GroomConjugalStatus | undefined
  >
  'marriageDetails.bridegroomDecreeAbsoluteDate': DivorceResolverFunction<CrvsDate>
  'marriageDetails.bridegroomFormerWifeDeathDate': DivorceResolverFunction<CrvsDate>
  'marriageDetails.residence': DivorceResolverFunction<Address | undefined>
  'marriageDetails.brideName': DivorceResolverFunction<Name>
  'marriageDetails.brideDob': DivorceResolverFunction<CrvsDate>
  'marriageDetails.bridePlaceOfBirth': DivorceResolverFunction<string>
  'marriageDetails.brideOccupation': DivorceResolverFunction<string>
  'marriageDetails.brideConjugalStatus': DivorceResolverFunction<
    BrideConjugalStatus | undefined
  >
  'marriageDetails.brideDecreeAbsoluteDate': DivorceResolverFunction<CrvsDate>
  'marriageDetails.brideFormerHusbandDeathDate': DivorceResolverFunction<CrvsDate>
  'marriageDetails.brideResidence': DivorceResolverFunction<Address | undefined>
  'divorceOrderDetails.orderNumber': string
  'divorceOrderDetails.issuingAuthority': DivorceResolverFunction<string>
  'divorceOrderDetails.orderDate': string
}

export type DivorceMetaData = {
  registrationDate: DivorceResolverFunction<string>
  locationCode: DivorceResolverFunction<string | null>
}
