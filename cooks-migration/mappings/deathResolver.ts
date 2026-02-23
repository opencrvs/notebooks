import { CsvFields, DeathCsvRecord } from '../helpers/csvTypes.ts'
import {
  DeathResolver,
  DeathMetaData,
  ChildrenCount
} from '../helpers/deathTypes.ts'
import { CrvsDate, Gender, IdType, LocationMap } from '../helpers/types.ts'
import {
  deriveName,
  getLocationCode,
  getLocationFromRegNum,
  resolveAddress,
  resolveFacility,
  toAge,
  toCrvsDate,
  toGender,
  toISODate
} from '../helpers/resolverHelpers.ts'
import { resolveLengthInCis } from '../lookupMappings/death/lengthInCis.ts'
import { parseInformantDescription } from '../lookupMappings/death/informantTypeMapping.ts'
import { ageMapping } from '../lookupMappings/death/ageMapping.ts'

const getAgeOfWidow = (data: string): (number | 'DECEASED' | 'DIVORCED')[] => {
  if (!data || data.trim() === '') {
    return []
  }
  const matches = data.match(/\b(DIVORCED|DECEASED|\d{2,3})\b/g)
  if (!matches) return []
  return matches
    .map((match) => {
      if (match === 'DIVORCED' || match === 'DECEASED') return match
      return parseInt(match, 10)
    })
    .reverse()
}

const getWhenMarried = (data: string): (CrvsDate | number)[] => {
  if (!data || data.trim() === '') {
    return []
  }

  const results: { index: number; value: CrvsDate | number }[] = []

  const dateRegex = /\b(\d{1,2}\/\d{1,2}\/\d{4})\b/g
  let match: RegExpExecArray | null
  while ((match = dateRegex.exec(data)) !== null) {
    const date = toCrvsDate(match[1], 'dd/MM/yyyy')
    if (date !== undefined) {
      results.push({ index: match.index, value: date })
    }
  }

  const cleaned = data.replace(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/g, (m) =>
    ' '.repeat(m.length)
  )

  const numberRegex = /\b(\d{2,})\b/g
  while ((match = numberRegex.exec(cleaned)) !== null) {
    results.push({ index: match.index, value: parseInt(match[1], 10) })
  }

  return results.sort((a, b) => b.index - a.index).map((r) => r.value)
}

const getLivingChildren = (data: string): number[] => {
  if (!data || data.trim() === '' || data.trim() === '-') {
    return []
  }

  const cleaned = data
    .replace(/\(\d+\)/g, '') // (1), (2), ...
    .replace(/\[\d+\]/g, '') // [1], [2], ...
    .replace(/\d+\./g, '') // 1., 2., ...
    .replace(/\d+:/g, '') // 1:, 2:, ...
    .replace(/\d+-/g, '') // 1-, 2-, ...
    .replace(/\//g, '') // / group separators

  const numbers = cleaned.match(/\d+/g)
  if (!numbers) return []

  return numbers.map((n) => parseInt(n, 10))
}

const getWhereMarried = (data: string): string[] => {
  if (!data || data.trim() === '') {
    return []
  }

  const separator = /(?:\d+|[A-Z])[.)-]+\s*/g

  const hasMarkers = separator.test(data)
  separator.lastIndex = 0

  if (!hasMarkers) {
    return [data.trim()]
  }

  return data
    .split(separator)
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .reverse()
}

const getWhomMarried = (data: string): string[] => {
  if (!data || data.trim() === '') {
    return []
  }

  const separator = /(?:\d+|[A-Z])[.)-]+\s*/g

  const hasMarkers = separator.test(data)
  separator.lastIndex = 0

  if (!hasMarkers) {
    return [data.trim()]
  }

  return data
    .split(separator)
    .map((part) => part.trim())
    .reverse()
}

const getChildren = (data: DeathCsvRecord) => {
  const livingFemales = getLivingChildren(data.LIVING_FEMALES).map((age) => ({
    sex: 'female' as Gender,
    age
  }))
  const livingMales = getLivingChildren(data.LIVING_MALES).map((age) => ({
    sex: 'male' as Gender,
    age
  }))
  return livingFemales.concat(livingMales).sort((a, b) => b.age - a.age)
}

const referredToCoroner = (data: DeathCsvRecord) => {
  return [
    data.CAUSE_OF_DEATH,
    data.MEDICAL_ATTENDANT,
    data.DATE_LAST_ALIVE,
    data.EXTRA_INFORMATION
  ].some(
    (field) =>
      field.toUpperCase().includes('CORONER') ||
      field.toUpperCase().includes('INQUEST')
  )
}

const motherNotAvailable = (data: DeathCsvRecord) =>
  Boolean(!data.MOTHERS_NAME && !data.MOTHERS_MAIDEN_NAME)

const fatherNotAvailable = (data: DeathCsvRecord) =>
  Boolean(!data.FATHERS_NAME && !data.FATHERS_OCCUPATION)

const spouseNotAvailable = (data: DeathCsvRecord) =>
  Boolean(
    !getAgeOfWidow(data.AGE_OF_WIDOW)[0] &&
    !getWhomMarried(data.WHOM_MARRIED)[0]
  )

export const deathResolver: DeathResolver = {
  'deceased.name': (data: DeathCsvRecord) => deriveName(data.NAME_OF_DECEASED),
  'deceased.gender': (data: DeathCsvRecord) => toGender(data.SEX),
  'deceased.dob': (data: DeathCsvRecord, all: CsvFields) => {
    const dob =
      all.birth.find((birth) => birth.BIRTH_REF === data.BIRTH_REF)
        ?.CHILDS_DOB || ''
    return toCrvsDate(dob)
  },
  'deceased.dobUnknown': (data: DeathCsvRecord, all: CsvFields) => {
    const dob =
      all.birth.find((birth) => birth.BIRTH_REF === data.BIRTH_REF)
        ?.CHILDS_DOB || ''
    return !toCrvsDate(dob)
  },
  'deceased.age': (data: DeathCsvRecord) => ageMapping[data.AGE],
  'deceased.placeOfBirth': (data: DeathCsvRecord) => data.WHERE_BORN,
  'deceased.nationality': (
    data: DeathCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) => resolveAddress(data.WHERE_BORN, locationMap)?.country,
  'deceased.idType': (_: DeathCsvRecord) => 'NONE' as IdType,
  'deceased.passport': '',
  'deceased.bc': '',
  'deceased.other': '',
  'deceased.occupation': (data: DeathCsvRecord) => data.OCCUPATION,
  'deceased.residence': (
    data: DeathCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) => resolveAddress(data.USUAL_RESIDENCE, locationMap),
  'deceased.sincebirth': (data: DeathCsvRecord) => {
    const resolved = resolveLengthInCis(
      data.LENGTH_IN_CIS,
      toAge(data.AGE),
      toCrvsDate(data.WHEN_DIED)
    )
    return resolved.sinceBirth ?? false
  },
  'deceased.noOfyearsLivedInCook': (data: DeathCsvRecord) => {
    const resolved = resolveLengthInCis(
      data.LENGTH_IN_CIS,
      toAge(data.AGE),
      toCrvsDate(data.WHEN_DIED)
    )
    return resolved.years || 0
  },
  'deceased.wasMarried': (data: DeathCsvRecord) => {
    const age = getAgeOfWidow(data.AGE_OF_WIDOW)[0]
    return !!age && age !== 'DIVORCED'
  },
  'deceased.dateOfMarriage': (data: DeathCsvRecord) => {
    const whenMarried = getWhenMarried(data.WHEN_MARRIED)[0]
    if (whenMarried && typeof whenMarried === 'string') {
      return whenMarried
    }
    const whenDied = toCrvsDate(data.WHEN_DIED)
    const ageDied = ageMapping[data.AGE]
    if (whenDied && ageDied && whenMarried && typeof whenMarried === 'number') {
      const deathDate = new Date(whenDied)
      const year = deathDate.getFullYear() - ageDied + whenMarried
      return `${year}-01-01` as CrvsDate // We don't have the month or day, so default to Jan 1st
    }
  },
  'deceased.placeOfMarriage': (data: DeathCsvRecord) =>
    getWhereMarried(data.WHERE_MARRIED)[0],
  'deceased.hadLivingChildren': (data: DeathCsvRecord) =>
    getLivingChildren(data.LIVING_FEMALES).concat(
      getLivingChildren(data.LIVING_MALES)
    ).length > 0,
  'eventDetails.dateOfDeath': (data: DeathCsvRecord) =>
    toCrvsDate(data.WHEN_DIED),
  'eventDetails.mannerOfDeath': (data: DeathCsvRecord) =>
    referredToCoroner(data) ? 'MANNER_UNDETERMINED' : 'MANNER_NATURAL',
  'eventDetails.placeOfDeath': (
    data: DeathCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
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
    locationMap: LocationMap[]
  ) => resolveFacility(data.WHERE_DIED, locationMap),
  'eventDetails.deathLocationOther': (
    data: DeathCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) => resolveAddress(data.WHERE_DIED, locationMap),
  'eventDetails.referredToCoroner': (data: DeathCsvRecord) =>
    referredToCoroner(data) ? 'Yes' : 'No',
  'eventDetails.fullNameOfCoroner': (data: DeathCsvRecord) =>
    referredToCoroner(data) ? data.MEDICAL_ATTENDANT : undefined,
  'eventDetails.causeOfDeathDeterminedByCoroner': (data: DeathCsvRecord) =>
    referredToCoroner(data) ? data.CAUSE_OF_DEATH : undefined,
  'eventDetails.causeOfDeathEstablished': (data: DeathCsvRecord) =>
    !!data.CAUSE_OF_DEATH,
  'eventDetails.medicalOfficerName': (data: DeathCsvRecord) =>
    data.MEDICAL_ATTENDANT,
  'eventDetails.dateLastSeenAlive': (data: DeathCsvRecord) =>
    toCrvsDate(data.DATE_LAST_ALIVE, 'dd/MM/yyyy'),
  'eventDetails.notPersonallyAttended': (_: DeathCsvRecord) => false,
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
  'burial.burialArrangement': (
    data: DeathCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) => {
    const whereBuried = resolveAddress(data.WHERE_BURIED, locationMap)?.country
    if (whereBuried === 'COK') {
      return 'BURIAL_IN_COOK_ISLANDS'
    } else if (
      whereBuried ||
      data.WHERE_BURIED.toUpperCase().includes('OVERSEAS')
    ) {
      return 'BURIAL_OUTSIDE_COOK_ISLANDS'
    } else if (data.WHERE_BURIED.toUpperCase().includes('SEA')) {
      return 'BURIAL_AT_SEA'
    }
    return 'BURIAL_IN_COOK_ISLANDS'
  },
  'burial.dateOfBurial': (data: DeathCsvRecord) => toCrvsDate(data.WHEN_BURIED),
  'burial.whereburied': (
    data: DeathCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) => resolveAddress(data.WHERE_BURIED, locationMap),
  'burial.burialPlaceDescription': (data: DeathCsvRecord) => data.WHERE_BURIED,
  'father.detailsNotAvailable': (data: DeathCsvRecord) =>
    fatherNotAvailable(data),
  'father.reason': (data: DeathCsvRecord) =>
    fatherNotAvailable(data) ? 'Legacy record' : '',
  'father.livingStatus': (data: DeathCsvRecord) => {
    const occupation = data.FATHERS_OCCUPATION
    const dead =
      occupation.includes('DECEASE') ||
      occupation.includes('DESEASE') ||
      occupation.includes('DEAD')
    return dead ? 'DECEASED' : 'ALIVE'
  },
  'father.name': (data: DeathCsvRecord) => deriveName(data.FATHERS_NAME),
  'father.dob': '',
  'father.dobUnknown': '',
  'father.age': '',
  'father.nationality': '',
  'father.idType': (_: DeathCsvRecord) => 'NONE' as IdType,
  'father.passport': '',
  'father.bc': '',
  'father.other': '',
  'father.occupation': (data: DeathCsvRecord) => data.FATHERS_OCCUPATION,
  'mother.detailsNotAvailable': (data: DeathCsvRecord) =>
    motherNotAvailable(data),
  'mother.reason': (data: DeathCsvRecord) =>
    motherNotAvailable(data) ? 'Legacy record' : '',
  'mother.livingStatus': '',
  'mother.name': (data: DeathCsvRecord) => deriveName(data.MOTHERS_NAME),
  'mother.maidenName': (data: DeathCsvRecord) => data.MOTHERS_MAIDEN_NAME,
  'mother.dob': '',
  'mother.dobUnknown': '',
  'mother.age': '',
  'mother.nationality': '',
  'mother.idType': (_: DeathCsvRecord) => 'NONE' as IdType,
  'mother.passport': '',
  'mother.brn': '',
  'mother.other': '',
  'mother.occupation': '',
  'spouse.detailsNotAvailable': (data: DeathCsvRecord) =>
    spouseNotAvailable(data),
  'spouse.reason': (data: DeathCsvRecord) =>
    spouseNotAvailable(data) ? 'Legacy record' : '',
  'spouse.livingStatus': (data: DeathCsvRecord) => {
    const age = getAgeOfWidow(data.AGE_OF_WIDOW)[0]
    if (age === 'DECEASED') return 'DECEASED'
    if (typeof age === 'number') return 'ALIVE'
  },
  'spouse.name': (data: DeathCsvRecord) =>
    deriveName(getWhomMarried(data.WHOM_MARRIED)[0] || ''), // Another weird format with multiple marriages
  'spouse.dob': '',
  'spouse.dobUnknown': (_: DeathCsvRecord) => true,
  'spouse.age': (data: DeathCsvRecord) => {
    const age = getAgeOfWidow(data.AGE_OF_WIDOW)[0]
    if (typeof age === 'number') return age
    return null
  },
  'spouse.nationality': '',
  'spouse.idType': (_: DeathCsvRecord) => 'NONE' as IdType,
  'spouse.passport': '',
  'spouse.bc': '',
  'spouse.other': '',
  'spouse.occupation': '',
  'deceased.childrenCount': (data: DeathCsvRecord) =>
    getChildren(data).length.toString() as ChildrenCount,
  'deceased.children.1.name': '',
  'deceased.children.1.sex': (data: DeathCsvRecord) =>
    getChildren(data)[0]?.sex,
  'deceased.children.1.age': (data: DeathCsvRecord) =>
    getChildren(data)[0]?.age,
  'deceased.children.2.name': '',
  'deceased.children.2.sex': (data: DeathCsvRecord) =>
    getChildren(data)[1]?.sex,
  'deceased.children.2.age': (data: DeathCsvRecord) =>
    getChildren(data)[1]?.age,
  'deceased.children.3.name': '',
  'deceased.children.3.sex': (data: DeathCsvRecord) =>
    getChildren(data)[2]?.sex,
  'deceased.children.3.age': (data: DeathCsvRecord) =>
    getChildren(data)[2]?.age,
  'deceased.children.4.name': '',
  'deceased.children.4.sex': (data: DeathCsvRecord) =>
    getChildren(data)[3]?.sex,
  'deceased.children.4.age': (data: DeathCsvRecord) =>
    getChildren(data)[3]?.age,
  'deceased.children.5.name': '',
  'deceased.children.5.sex': (data: DeathCsvRecord) =>
    getChildren(data)[4]?.sex,
  'deceased.children.5.age': (data: DeathCsvRecord) =>
    getChildren(data)[4]?.age,
  'deceased.children.6.name': '',
  'deceased.children.6.sex': (data: DeathCsvRecord) =>
    getChildren(data)[5]?.sex,
  'deceased.children.6.age': (data: DeathCsvRecord) =>
    getChildren(data)[5]?.age,
  'deceased.children.7.name': '',
  'deceased.children.7.sex': (data: DeathCsvRecord) =>
    getChildren(data)[6]?.sex,
  'deceased.children.7.age': (data: DeathCsvRecord) =>
    getChildren(data)[6]?.age,
  'deceased.children.8.name': '',
  'deceased.children.8.sex': (data: DeathCsvRecord) =>
    getChildren(data)[7]?.sex,
  'deceased.children.8.age': (data: DeathCsvRecord) =>
    getChildren(data)[7]?.age,
  'deceased.children.9.name': '',
  'deceased.children.9.sex': (data: DeathCsvRecord) =>
    getChildren(data)[8]?.sex,
  'deceased.children.9.age': (data: DeathCsvRecord) =>
    getChildren(data)[8]?.age,
  'deceased.children.10.name': '',
  'deceased.children.10.sex': (data: DeathCsvRecord) =>
    getChildren(data)[9]?.sex,
  'deceased.children.10.age': (data: DeathCsvRecord) =>
    getChildren(data)[9]?.age,
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
  'informant.idType': (_: DeathCsvRecord) => 'NONE' as IdType,
  'informant.passport': '',
  'informant.bc': '',
  'informant.other': '',
  'informant.occupation': '',
  'informant.addressSameAs': '',
  'informant.address': (
    data: DeathCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) => resolveAddress(data.INFORMANT_RESIDENCE, locationMap),
  'informant.phoneNo': '',
  'informant.email': ''
}

export const deathMetaData: DeathMetaData = {
  registrationDate: (data: DeathCsvRecord) => toISODate(data.DATE_REGISTERED),
  registrar: (data: DeathCsvRecord) => data.REGISTRAR,
  locationCode: (
    data: DeathCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) =>
    getLocationCode(data.WHERE_DIED, locationMap) ||
    getLocationFromRegNum(data.DEATH_NUMBER)
}
