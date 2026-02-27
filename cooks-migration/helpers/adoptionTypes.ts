import { Address, Country } from './addressConfig.ts'
import { AdoptionCsvRecord, CsvFields } from './csvTypes.ts'
import { Age, CrvsDate, Gender, IdType, LocationMap, Name } from './types.ts'

export type ResolverFunction<T> =
  | ((data: AdoptionCsvRecord) => T)
  | ((data: AdoptionCsvRecord, all: CsvFields) => T)
  | ((data: AdoptionCsvRecord, all: CsvFields, locationMap: LocationMap[]) => T)

type YesNo = 'yes' | 'no'

export type AdoptionResolver = {
  'child.brnSearch': string
  'child.brn': ResolverFunction<string>
  'child.name': ResolverFunction<Name>
  'child.dob': ResolverFunction<CrvsDate>
  'child.gender': ResolverFunction<Gender>
  'child.birthLocation': ResolverFunction<string>
  'consent.notProvidedOrWaived': ResolverFunction<boolean>
  'consent.numberOfParties': string
  'consenter.cp1.name': string
  'consenter.cp1.relationship': string
  'consenter.cp1.relationshipSpecify': string
  'consenter.cp1.dob': string
  'consenter.cp1.dobUnknown': string
  'consenter.cp1.age': string
  'consenter.cp1.residence': string
  'consenter.cp1.occupation': string
  'consenter.cp2.name': string
  'consenter.cp2.relationship': string
  'consenter.cp2.relationshipSpecify': string
  'consenter.cp2.dob': string
  'consenter.cp2.dobUnknown': string
  'consenter.cp2.age': string
  'consenter.cp2.residence': string
  'consenter.cp2.occupation': string
  'adoptiveMother.detailsUnavailable': ResolverFunction<boolean>
  'adoptiveMother.unavailableReason': ResolverFunction<string | undefined>
  'adoptiveMother.name': ResolverFunction<Name>
  'adoptiveMother.dob': ResolverFunction<CrvsDate>
  'adoptiveMother.dobUnknown': ResolverFunction<boolean>
  'adoptiveMother.age': ResolverFunction<Age | undefined>
  'adoptiveMother.maritalStatus': string
  'adoptiveMother.maidenName': ResolverFunction<string>
  'adoptiveMother.placeOfBirth': ResolverFunction<string>
  'adoptiveMother.nationality': ResolverFunction<Country | undefined>
  'adoptiveMother.idType': ResolverFunction<IdType>
  'adoptiveMother.idTypeOther': string
  'adoptiveMother.idNumber': string
  'adoptiveMother.residence': ResolverFunction<Address | undefined>
  'adoptiveMother.occupation': string
  'adoptiveFather.detailsUnavailable': ResolverFunction<boolean>
  'adoptiveFather.unavailableReason': ResolverFunction<string | undefined>
  'adoptiveFather.name': ResolverFunction<Name>
  'adoptiveFather.dob': ResolverFunction<CrvsDate>
  'adoptiveFather.dobUnknown': ResolverFunction<boolean>
  'adoptiveFather.age': ResolverFunction<Age | undefined>
  'adoptiveFather.placeOfBirth': ResolverFunction<string>
  'adoptiveFather.nationality': ResolverFunction<Country | undefined>
  'adoptiveFather.idType': ResolverFunction<IdType>
  'adoptiveFather.idTypeOther': string
  'adoptiveFather.idNumber': string
  'adoptiveFather.residence': ResolverFunction<Address | undefined>
  'adoptiveFather.occupation': ResolverFunction<string>
  'adoptionOrder.number': ResolverFunction<string>
  'adoptionOrder.issuingAuthority': ResolverFunction<string>
  'adoptionOrder.date': ResolverFunction<CrvsDate>
  'adoptionOrder.changesChildLegalName': ResolverFunction<YesNo>
  'adoptionOrder.childNewName': ResolverFunction<Name | undefined>
}

export type AdoptionMetaData = {
  registrationDate: ResolverFunction<string>
  locationCode: ResolverFunction<string | null>
}
