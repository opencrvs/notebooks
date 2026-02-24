import { Address, Country } from './addressConfig.ts'
import { BirthCsvRecord, CsvFields } from './csvTypes.ts'
import { FacilityId } from './resolverHelpers.ts'
import { CrvsDate, Gender, IdType, LocationMap, Name } from './types.ts'

export type BirthInformant = 'MOTHER' | 'FATHER' | 'MOTHER_AND_FATHER' | 'OTHER'

export type ResolverFunction<T> =
  | ((data: BirthCsvRecord) => T)
  | ((data: BirthCsvRecord, all: CsvFields) => T)
  | ((data: BirthCsvRecord, all: CsvFields, locationMap: LocationMap[]) => T)

export type PlaceOfBirth = 'HEALTH_FACILITY' | 'OTHER'

export type BirthType =
  | 'SINGLE'
  | 'TWIN'
  | 'TRIPLETS'
  | 'HIGHER_MULTIPLE_DELIVERY'

export type OrderOfBirthTwins = 'ELDER_OF_TWINS' | 'YOUNGER_OF_TWINS'

export type OrderOfBirthTriplets = 'FIRST_BORN' | 'SECOND_BORN' | 'THIRD_BORN'
export type OrderOfBirthHigherMultiple =
  | 'FIRST_BORN'
  | 'SECOND_BORN'
  | 'THIRD_BORN'
  | 'FOURTH_BORN'
  | 'FIFTH_BORN'
  | 'SIXTH_BORN'
  | 'SEVENTH_BORN'

export type AttendantAtBirth = 'OTHER'

export type BirthResolver = {
  'child.name': ResolverFunction<Name>
  'child.dob': ResolverFunction<CrvsDate>
  'child.reason': ResolverFunction<string>
  'child.gender': ResolverFunction<Gender>
  'child.placeOfBirth': ResolverFunction<PlaceOfBirth>
  'child.birthLocation': ResolverFunction<FacilityId | null>
  'child.birthLocation.privateHome': string
  'child.birthLocation.other': ResolverFunction<Address | undefined>
  'child.birthType': ResolverFunction<BirthType>
  'child.orderOfBirth.twins': ResolverFunction<OrderOfBirthTwins | null>
  'child.orderOfBirth.triplets': ResolverFunction<OrderOfBirthTriplets | null>
  'child.orderOfBirth.higherMultiple': ResolverFunction<OrderOfBirthHigherMultiple | null>
  'child.weightAtBirth': string
  'child.attendantAtBirth': ResolverFunction<AttendantAtBirth>
  'child.attendantAtBirth.other': ResolverFunction<string>
  'child.attendantAtBirth.givenNames': ResolverFunction<string>
  'child.attendantAtBirth.surname': ResolverFunction<string>
  'child.isRenamed': ResolverFunction<boolean>
  'child.isAdoptionOrder': ResolverFunction<boolean>
  'nameChange.deedPollNumber1': ResolverFunction<string | undefined>
  'nameChange.newGivenNames1': ResolverFunction<string | undefined>
  'nameChange.newSurname1': ResolverFunction<string | undefined>
  'nameChange.addAnother1': string
  'nameChange.deedPollNumber2': ResolverFunction<string | undefined>
  'nameChange.newGivenNames2': ResolverFunction<string | undefined>
  'nameChange.newSurname2': ResolverFunction<string | undefined>
  'nameChange.addAnother2': string
  'nameChange.deedPollNumber3': ResolverFunction<string | undefined>
  'nameChange.newGivenNames3': ResolverFunction<string | undefined>
  'nameChange.newSurname3': ResolverFunction<string | undefined>
  'adoptionOrder.registrationNumber': ResolverFunction<string | undefined>
  'adoptionOrder.orderDocument': string
  'mother.detailsUnavailable': ResolverFunction<boolean>
  'mother.unavailableReason': ResolverFunction<string | undefined>
  'mother.name': ResolverFunction<Name>
  'mother.dob': ResolverFunction<CrvsDate>
  'mother.dobUnknown': ResolverFunction<boolean>
  'mother.age': ResolverFunction<number | null>
  'mother.maritalStatus': string
  'mother.maidenName': ResolverFunction<string>
  'mother.placeOfBirth': ResolverFunction<string>
  'mother.nationality': ResolverFunction<Country | undefined>
  'mother.idType': ResolverFunction<IdType>
  'mother.passport': string
  'mother.bc': string
  'mother.other': string
  'mother.address': ResolverFunction<Address | undefined>
  'mother.occupation': string
  'father.detailsUnavailable': ResolverFunction<boolean>
  'father.unavailableReason': ResolverFunction<string | undefined>
  'father.name': ResolverFunction<Name>
  'father.dob': ResolverFunction<CrvsDate>
  'father.dobUnknown': ResolverFunction<boolean>
  'father.age': ResolverFunction<number | null>
  'father.placeOfBirth': ResolverFunction<string | undefined>
  'father.nationality': ResolverFunction<Country | undefined>
  'father.idType': ResolverFunction<IdType>
  'father.passport': string
  'father.bc': string
  'father.other': string
  'father.sameAsMotherResidence': string
  'father.address': ResolverFunction<Address | undefined>
  'father.occupation': ResolverFunction<string>
  'informant.relation': ResolverFunction<BirthInformant>
  'informant.other.relation': ResolverFunction<string | null>
  'informant.name': ResolverFunction<Name>
  'informant.dob': string
  'informant.dobUnknown': string
  'informant.age': string
  'informant.nationality': string
  'informant.idType': string
  'informant.passport': string
  'informant.bc': string
  'informant.other': string
  'informant.address': ResolverFunction<Address | undefined>
  'informant.occupation': ResolverFunction<string>
  'informant.phoneNo': string
  'informant.email': string
}

export type BirthMetaData = {
  registrationDate: ResolverFunction<string>
  locationCode: ResolverFunction<string | null>
}
