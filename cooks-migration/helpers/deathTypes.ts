import { Address } from './addressConfig.ts'
import { CsvFields, DeathCsvRecord } from './csvTypes.ts'
import { Gender, LocationMap, Name } from './types.ts'

export type ResolverFunction<T> =
  | ((data: DeathCsvRecord) => T)
  | ((data: DeathCsvRecord, all: CsvFields) => T)
  | ((data: DeathCsvRecord, all: CsvFields, locationMap: LocationMap[]) => T)

type PlaceOfDeath = 'DECEASED_USUAL_RESIDENCE' | 'HEALTH_FACILITY' | 'OTHER'

export type DeathInformant = 'SPOUSE' | 'MOTHER' | 'FATHER' | 'OTHER'

export type DeathResolver = {
  'informant.contact': string
  'reason.option': string
  'reason.other': string
  'deceased.name': ResolverFunction<Name>
  'deceased.gender': ResolverFunction<Gender>
  'deceased.dob': string
  'deceased.dobUnknown': string
  'deceased.age': ResolverFunction<number | null>
  'deceased.placeOfBirth': ResolverFunction<string>
  'deceased.nationality': string
  'deceased.idType': string
  'deceased.passport': string
  'deceased.bc': string
  'deceased.other': string
  'deceased.occupation': ResolverFunction<string>
  'deceased.residence': ResolverFunction<Address | undefined>
  'deceased.sincebirth': ResolverFunction<boolean>
  'deceased.noOfyearsLivedInCook': ResolverFunction<number>
  'deceased.wasMarried': string
  'deceased.dateOfMarriage': ResolverFunction<string>
  'deceased.placeOfMarriage': ResolverFunction<Address | undefined>
  'deceased.hadLivingChildren': string
  'eventDetails.dateOfDeath': ResolverFunction<string>
  'eventDetails.mannerOfDeath': string
  'eventDetails.placeOfDeath': ResolverFunction<PlaceOfDeath | null>
  'eventDetails.deathLocation': ResolverFunction<string | null>
  'eventDetails.deathLocationOther': ResolverFunction<Address | undefined>
  'eventDetails.referredToCoroner': string
  'eventDetails.fullNameOfCoroner': string
  'eventDetails.causeOfDeathDeterminedByCoroner': string
  'eventDetails.causeOfDeathEstablished': string
  'eventDetails.medicalOfficerName': ResolverFunction<string>
  'eventDetails.dateLastSeenAlive': ResolverFunction<string>
  'eventDetails.notPersonallyAttended': string
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
  'burial.burialArrangement': string
  'burial.dateOfBurial': ResolverFunction<string>
  'burial.whereburied': ResolverFunction<Address | undefined>
  'burial.burialPlaceDescription': string
  'father.detailsNotAvailable': string
  'father.reason': string
  'father.livingStatus': string
  'father.name': ResolverFunction<Name>
  'father.dob': string
  'father.dobUnknown': string
  'father.age': string
  'father.nationality': string
  'father.idType': string
  'father.passport': string
  'father.bc': string
  'father.other': string
  'father.occupation': ResolverFunction<string>
  'mother.detailsNotAvailable': string
  'mother.reason': string
  'mother.livingStatus': string
  'mother.name': ResolverFunction<Name>
  'mother.maidenName': ResolverFunction<string>
  'mother.dob': string
  'mother.dobUnknown': string
  'mother.age': string
  'mother.nationality': string
  'mother.idType': string
  'mother.passport': string
  'mother.brn': string
  'mother.other': string
  'mother.occupation': string
  'spouse.detailsNotAvailable': string
  'spouse.reason': string
  'spouse.livingStatus': ResolverFunction<string>
  'spouse.name': ResolverFunction<string>
  'spouse.dob': string
  'spouse.dobUnknown': string
  'spouse.age': ResolverFunction<string>
  'spouse.nationality': string
  'spouse.idType': string
  'spouse.passport': string
  'spouse.bc': string
  'spouse.other': string
  'spouse.occupation': string
  'deceased.childrenCount': string
  'deceased.children.1.name': string
  'deceased.children.1.sex': string
  'deceased.children.1.age': string
  'deceased.children.2.name': string
  'deceased.children.2.sex': string
  'deceased.children.2.age': string
  'deceased.children.3.name': string
  'deceased.children.3.sex': string
  'deceased.children.3.age': string
  'deceased.children.4.name': string
  'deceased.children.4.sex': string
  'deceased.children.4.age': string
  'deceased.children.5.name': string
  'deceased.children.5.sex': string
  'deceased.children.5.age': string
  'deceased.children.6.name': string
  'deceased.children.6.sex': string
  'deceased.children.6.age': string
  'deceased.children.7.name': string
  'deceased.children.7.sex': string
  'deceased.children.7.age': string
  'deceased.children.8.name': string
  'deceased.children.8.sex': string
  'deceased.children.8.age': string
  'deceased.children.9.name': string
  'deceased.children.9.sex': string
  'deceased.children.9.age': string
  'deceased.children.10.name': string
  'deceased.children.10.sex': string
  'deceased.children.10.age': string
  'deceased.additionalChildrenSummary': string
  'informant.relation': ResolverFunction<DeathInformant>
  'informant.name': ResolverFunction<Name>
  'informant.dob': string
  'informant.nationality': string
  'informant.idType': string
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
