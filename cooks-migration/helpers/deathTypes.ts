import { Address, Country } from './addressConfig.ts'
import { CsvFields, DeathCsvRecord } from './csvTypes.ts'
import { FacilityId } from './resolverHelpers.ts'
import { CrvsDate, Gender, IdType, LocationMap, Name } from './types.ts'

export type ResolverFunction<T> =
  | ((data: DeathCsvRecord) => T)
  | ((data: DeathCsvRecord, all: CsvFields) => T)
  | ((data: DeathCsvRecord, all: CsvFields, locationMap: LocationMap[]) => T)

type PlaceOfDeath = 'DECEASED_USUAL_RESIDENCE' | 'HEALTH_FACILITY' | 'OTHER'

export type DeathInformant = 'SPOUSE' | 'MOTHER' | 'FATHER' | 'OTHER'

type LivingStatus = 'ALIVE' | 'DECEASED'

type MannerOfDeath = 'MANNER_UNDETERMINED' | 'MANNER_NATURAL'

type YesNo = 'Yes' | 'No'

export type ChildrenCount =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10+'

type BurialArrangement =
  | 'BURIAL_IN_COOK_ISLANDS'
  | 'BURIAL_OUTSIDE_COOK_ISLANDS'
  | 'BURIAL_AT_SEA'

export type DeathResolver = {
  'deceased.name': ResolverFunction<Name>
  'deceased.gender': ResolverFunction<Gender>
  'deceased.dob': ResolverFunction<CrvsDate>
  'deceased.dobUnknown': ResolverFunction<boolean>
  'deceased.age': ResolverFunction<number | null>
  'deceased.placeOfBirth': ResolverFunction<string>
  'deceased.nationality': ResolverFunction<Country | undefined>
  'deceased.idType': ResolverFunction<IdType>
  'deceased.passport': string
  'deceased.bc': string
  'deceased.other': string
  'deceased.occupation': ResolverFunction<string>
  'deceased.residence': ResolverFunction<Address | undefined>
  'deceased.sincebirth': ResolverFunction<boolean>
  'deceased.noOfyearsLivedInCook': ResolverFunction<number>
  'deceased.wasMarried': ResolverFunction<boolean>
  'deceased.dateOfMarriage': ResolverFunction<CrvsDate>
  'deceased.placeOfMarriage': ResolverFunction<string>
  'deceased.hadLivingChildren': ResolverFunction<boolean>
  'eventDetails.dateOfDeath': ResolverFunction<CrvsDate>
  'eventDetails.mannerOfDeath': ResolverFunction<MannerOfDeath>
  'eventDetails.placeOfDeath': ResolverFunction<PlaceOfDeath | null>
  'eventDetails.deathLocation': ResolverFunction<FacilityId | null>
  'eventDetails.deathLocationOther': ResolverFunction<Address | undefined>
  'eventDetails.referredToCoroner': ResolverFunction<YesNo>
  'eventDetails.fullNameOfCoroner': ResolverFunction<string | undefined>
  'eventDetails.causeOfDeathDeterminedByCoroner': ResolverFunction<
    string | undefined
  >
  'eventDetails.causeOfDeathEstablished': ResolverFunction<boolean>
  'eventDetails.medicalOfficerName': ResolverFunction<string>
  'eventDetails.dateLastSeenAlive': ResolverFunction<CrvsDate>
  'eventDetails.notPersonallyAttended': ResolverFunction<boolean>
  'eventDetails.causeOfDeath': ResolverFunction<string>
  'eventDetails.duration': string
  'eventDetails.ICD10CodeA': string
  'eventDetails.b.CauseOfDeath': string
  'eventDetails.b.duration': string
  'eventDetails.ICD10CodeB': string
  'eventDetails.c.CauseOfDeath': string
  'eventDetails.c.duration': string
  'eventDetails.ICD10CodeC': string
  'eventDetails.d.CauseOfDeath': string
  'eventDetails.d.duration': string
  'eventDetails.ICD10CodeD': string
  'eventDetails.otherSignificantCondition': string
  'eventDetails.approximateDuration': string
  'eventDetails.otherSignificantConditionIfApplicable': string
  'eventDetails.approximateDuration2': string
  'burial.burialArrangement': ResolverFunction<BurialArrangement>
  'burial.dateOfBurial': ResolverFunction<CrvsDate>
  'burial.whereburied': ResolverFunction<Address | undefined>
  'burial.burialPlaceDescription': ResolverFunction<string>
  'father.detailsNotAvailable': ResolverFunction<boolean>
  'father.reason': ResolverFunction<string | undefined>
  'father.livingStatus': ResolverFunction<LivingStatus | undefined>
  'father.name': ResolverFunction<Name>
  'father.dob': string
  'father.dobUnknown': string
  'father.age': string
  'father.nationality': string
  'father.idType': ResolverFunction<IdType>
  'father.passport': string
  'father.bc': string
  'father.other': string
  'father.occupation': ResolverFunction<string>
  'mother.detailsNotAvailable': ResolverFunction<boolean>
  'mother.reason': ResolverFunction<string | undefined>
  'mother.livingStatus': string
  'mother.name': ResolverFunction<Name>
  'mother.maidenName': ResolverFunction<string>
  'mother.dob': string
  'mother.dobUnknown': string
  'mother.age': string
  'mother.nationality': string
  'mother.idType': ResolverFunction<IdType>
  'mother.passport': string
  'mother.brn': string
  'mother.other': string
  'mother.occupation': string
  'spouse.detailsNotAvailable': ResolverFunction<boolean>
  'spouse.reason': ResolverFunction<string | undefined>
  'spouse.livingStatus': ResolverFunction<LivingStatus | undefined>
  'spouse.name': ResolverFunction<Name>
  'spouse.dob': string
  'spouse.dobUnknown': ResolverFunction<boolean>
  'spouse.age': ResolverFunction<number | null>
  'spouse.nationality': string
  'spouse.idType': ResolverFunction<IdType>
  'spouse.passport': string
  'spouse.bc': string
  'spouse.other': string
  'spouse.occupation': string
  'deceased.childrenCount': ResolverFunction<ChildrenCount>
  'deceased.children.1.name': string
  'deceased.children.1.sex': ResolverFunction<Gender>
  'deceased.children.1.age': ResolverFunction<number>
  'deceased.children.2.name': string
  'deceased.children.2.sex': ResolverFunction<Gender>
  'deceased.children.2.age': ResolverFunction<number>
  'deceased.children.3.name': string
  'deceased.children.3.sex': ResolverFunction<Gender>
  'deceased.children.3.age': ResolverFunction<number>
  'deceased.children.4.name': string
  'deceased.children.4.sex': ResolverFunction<Gender>
  'deceased.children.4.age': ResolverFunction<number>
  'deceased.children.5.name': string
  'deceased.children.5.sex': ResolverFunction<Gender>
  'deceased.children.5.age': ResolverFunction<number>
  'deceased.children.6.name': string
  'deceased.children.6.sex': ResolverFunction<Gender>
  'deceased.children.6.age': ResolverFunction<number>
  'deceased.children.7.name': string
  'deceased.children.7.sex': ResolverFunction<Gender>
  'deceased.children.7.age': ResolverFunction<number>
  'deceased.children.8.name': string
  'deceased.children.8.sex': ResolverFunction<Gender>
  'deceased.children.8.age': ResolverFunction<number>
  'deceased.children.9.name': string
  'deceased.children.9.sex': ResolverFunction<Gender>
  'deceased.children.9.age': ResolverFunction<number>
  'deceased.children.10.name': string
  'deceased.children.10.sex': ResolverFunction<Gender>
  'deceased.children.10.age': ResolverFunction<number>
  'deceased.additionalChildrenSummary': string
  'informant.relation': ResolverFunction<DeathInformant>
  'informant.other.relation': ResolverFunction<string | undefined>
  'informant.name': ResolverFunction<Name>
  'informant.dob': string
  'informant.nationality': string
  'informant.idType': ResolverFunction<IdType>
  'informant.passport': string
  'informant.bc': string
  'informant.other': string
  'informant.occupation': string
  'informant.addressSameAs': string
  'informant.address': ResolverFunction<Address | undefined>
  'informant.phoneNo': string
  'informant.email': string
}

export type DeathMetaData = {
  registrationDate: ResolverFunction<string>
  registrar: ResolverFunction<string>
  locationCode: ResolverFunction<string | null>
}
