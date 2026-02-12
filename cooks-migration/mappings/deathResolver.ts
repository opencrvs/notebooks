import { CsvFields, DeathCsvRecord } from '../helpers/csvTypes.ts'
import { DeathResolver, DeathMetaData } from '../helpers/deathTypes.ts'
import { LocationMap } from '../helpers/types.ts'
import {
  deriveName,
  getLocationCode,
  getLocationFromRegNum,
  resolveAddress,
  resolveFacility,
  toAge,
  toCrvsDate,
  toGender,
  toISODate,
} from '../helpers/resolverHelpers.ts'
import { resolveLengthInCis } from '../lookupMappings/death/lengthInCis.ts'
import { parseInformantDescription } from '../lookupMappings/death/informantTypeMapping.ts'
import { ageMapping } from '../lookupMappings/death/ageMapping.ts'

export const deathResolver: DeathResolver = {
  'informant.contact': '',
  'reason.option': '',
  'reason.other': '',
  'deceased.name': (data: DeathCsvRecord) => deriveName(data.NAME_OF_DECEASED),
  'deceased.gender': (data: DeathCsvRecord) => toGender(data.SEX),
  'deceased.dob': '', // Possibly birth.CHILDS_DOB
  'deceased.dobUnknown': '', // Calculate
  'deceased.age': (data: DeathCsvRecord) => ageMapping[data.AGE],
  'deceased.placeOfBirth': (data: DeathCsvRecord) => data.WHERE_BORN,
  'deceased.nationality': '',
  'deceased.idType': '',
  'deceased.passport': '',
  'deceased.bc': '',
  'deceased.other': '',
  'deceased.occupation': (data: DeathCsvRecord) => data.OCCUPATION,
  'deceased.residence': (
    data: DeathCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[],
  ) => resolveAddress(data.USUAL_RESIDENCE, locationMap),
  'deceased.sincebirth': (data: DeathCsvRecord) => {
    const resolved = resolveLengthInCis(
      data.LENGTH_IN_CIS,
      toAge(data.AGE),
      toCrvsDate(data.WHEN_DIED),
    )
    return resolved.sinceBirth ?? false
  },
  'deceased.noOfyearsLivedInCook': (data: DeathCsvRecord) => {
    const resolved = resolveLengthInCis(
      data.LENGTH_IN_CIS,
      toAge(data.AGE),
      toCrvsDate(data.WHEN_DIED),
    )
    return resolved.years || 0
  },
  'deceased.wasMarried': '', // Calculate
  'deceased.dateOfMarriage': (data: DeathCsvRecord) =>
    toCrvsDate(data.WHEN_MARRIED),
  'deceased.placeOfMarriage': (data: DeathCsvRecord) => data.WHERE_MARRIED,
  'deceased.hadLivingChildren': '', // Calculate
  'eventDetails.dateOfDeath': (data: DeathCsvRecord) =>
    toCrvsDate(data.WHEN_DIED),
  'eventDetails.mannerOfDeath': '',
  'eventDetails.placeOfDeath': (
    data: DeathCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[],
  ) => {
    if (resolveFacility(data.WHERE_DIED, locationMap)) {
      return 'HEALTH_FACILITY'
    }
    const died = resolveAddress(data.WHERE_DIED, locationMap)
    const lived = resolveAddress(data.USUAL_RESIDENCE, locationMap)
    if (JSON.stringify(died) === JSON.stringify(lived)) {
      return 'DECEASED_USUAL_RESIDENCE'
    }
    return 'OTHER'
  },
  'eventDetails.deathLocation': (
    data: DeathCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[],
  ) => resolveFacility(data.WHERE_DIED, locationMap),
  'eventDetails.deathLocationOther': (
    data: DeathCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[],
  ) => resolveAddress(data.WHERE_DIED, locationMap),
  'eventDetails.referredToCoroner': '',
  'eventDetails.fullNameOfCoroner': '',
  'eventDetails.causeOfDeathDeterminedByCoroner': '',
  'eventDetails.causeOfDeathEstablished': '',
  'eventDetails.medicalOfficerName': (data: DeathCsvRecord) =>
    data.MEDICAL_ATTENDANT,
  'eventDetails.dateLastSeenAlive': (data: DeathCsvRecord) =>
    toCrvsDate(data.DATE_LAST_ALIVE, 'dd/MM/yyyy'),
  'eventDetails.notPersonallyAttended': '',
  'eventDetails.causeOfDeath': (data: DeathCsvRecord) => data.CAUSE_OF_DEATH,
  'eventDetails.duration': '',
  'eventDetails.ICD10CodeA': '',
  'eventDetails.b.CauseOfDeath': '',
  'eventDetails.b.duration': '',
  'eventDetails.ICD10CodeB': '',
  'eventDetails.c.CauseOfDeath': '',
  'eventDetails.c.duration': '',
  'eventDetails.ICD10CodeC': '',
  'eventDetails.d.CauseOfDeath': '',
  'eventDetails.d.duration': '',
  'eventDetails.ICD10CodeD': '',
  'eventDetails.otherSignificantCondition': '',
  'eventDetails.approximateDuration': '',
  'eventDetails.otherSignificantConditionIfApplicable': '',
  'eventDetails.approximateDuration2': '',
  'burial.burialArrangement': '',
  'burial.dateOfBurial': (data: DeathCsvRecord) => toCrvsDate(data.WHEN_BURIED),
  'burial.whereburied': (
    data: DeathCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[],
  ) => resolveAddress(data.WHERE_BURIED, locationMap),
  'burial.burialPlaceDescription': '',
  'father.detailsNotAvailable': '', // Calculate
  'father.reason': '',
  'father.livingStatus': '',
  'father.name': (data: DeathCsvRecord) => deriveName(data.FATHERS_NAME),
  'father.dob': '',
  'father.dobUnknown': '',
  'father.age': '',
  'father.nationality': '',
  'father.idType': '',
  'father.passport': '',
  'father.bc': '',
  'father.other': '',
  'father.occupation': (data: DeathCsvRecord) => data.FATHERS_OCCUPATION,
  'mother.detailsNotAvailable': '',
  'mother.reason': '',
  'mother.livingStatus': '',
  'mother.name': (data: DeathCsvRecord) => deriveName(data.MOTHERS_NAME),
  'mother.maidenName': (data: DeathCsvRecord) => data.MOTHERS_MAIDEN_NAME,
  'mother.dob': '',
  'mother.dobUnknown': '',
  'mother.age': '',
  'mother.nationality': '',
  'mother.idType': '',
  'mother.passport': '',
  'mother.brn': '',
  'mother.other': '',
  'mother.occupation': '',
  'spouse.detailsNotAvailable': '',
  'spouse.reason': '',
  'spouse.livingStatus': (data: DeathCsvRecord) => data.AGE_OF_WIDOW, // This is what shez was talking about, how do we do this?
  'spouse.name': (data: DeathCsvRecord) => data.WHOM_MARRIED, // Another weird format with multiple marriages
  'spouse.dob': '',
  'spouse.dobUnknown': '',
  'spouse.age': (data: DeathCsvRecord) => data.AGE_OF_WIDOW, // Another weird format
  'spouse.nationality': '',
  'spouse.idType': '',
  'spouse.passport': '',
  'spouse.bc': '',
  'spouse.other': '',
  'spouse.occupation': '',
  'deceased.childrenCount': '', // Can we look these up?
  'deceased.children.1.name': '',
  'deceased.children.1.sex': '',
  'deceased.children.1.age': '',
  'deceased.children.2.name': '',
  'deceased.children.2.sex': '',
  'deceased.children.2.age': '',
  'deceased.children.3.name': '',
  'deceased.children.3.sex': '',
  'deceased.children.3.age': '',
  'deceased.children.4.name': '',
  'deceased.children.4.sex': '',
  'deceased.children.4.age': '',
  'deceased.children.5.name': '',
  'deceased.children.5.sex': '',
  'deceased.children.5.age': '',
  'deceased.children.6.name': '',
  'deceased.children.6.sex': '',
  'deceased.children.6.age': '',
  'deceased.children.7.name': '',
  'deceased.children.7.sex': '',
  'deceased.children.7.age': '',
  'deceased.children.8.name': '',
  'deceased.children.8.sex': '',
  'deceased.children.8.age': '',
  'deceased.children.9.name': '',
  'deceased.children.9.sex': '',
  'deceased.children.9.age': '',
  'deceased.children.10.name': '',
  'deceased.children.10.sex': '',
  'deceased.children.10.age': '',
  'deceased.additionalChildrenSummary': '',
  'informant.relation': (data: DeathCsvRecord) => {
    const parsed = parseInformantDescription(data.INFORMANT_DESCRIPTION)
    return parsed.relationType
  },
  'informant.other.relation': (data: DeathCsvRecord) => {
    const parsed = parseInformantDescription(data.INFORMANT_DESCRIPTION)
    return parsed.otherRelation
  },
  'informant.name': (data: DeathCsvRecord) => {
    const parsed = parseInformantDescription(data.INFORMANT_DESCRIPTION)
    return deriveName(parsed.name)
  },
  'informant.dob': '',
  'informant.nationality': '',
  'informant.idType': '',
  'informant.passport': '',
  'informant.bc': '',
  'informant.other': '',
  'informant.occupation': '',
  'informant.addressSameAs': '',
  'informant.address': (
    data: DeathCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[],
  ) => resolveAddress(data.INFORMANT_RESIDENCE, locationMap),
  'informant.phoneNo': '',
  'informant.email': '',
}

export const deathMetaData: DeathMetaData = {
  registrationDate: (data: DeathCsvRecord) => toISODate(data.DATE_REGISTERED),
  registrar: (data: DeathCsvRecord) => data.REGISTRAR,
  locationCode: (
    data: DeathCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[],
  ) =>
    getLocationCode(data.WHERE_DIED, locationMap) ||
    getLocationFromRegNum(data.DEATH_NUMBER),
}
