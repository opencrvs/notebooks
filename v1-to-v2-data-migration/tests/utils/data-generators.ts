import { faker } from '@faker-js/faker'
import { format, subDays, subYears } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { getAllLocations } from '../utils.ts'
import type { fhir } from 'fhir'

// Types for generated data
export interface GeneratedName {
  use: 'en'
  firstNames: string
  middleName?: string
  familyName: string
}

export interface GeneratedAddress {
  type: 'PRIMARY_ADDRESS'
  line: string[]
  country: string
  state: string
  partOf: string
  district: string
  city: string
  postalCode: string
}

export interface GeneratedIdentifier {
  id: string
  type: 'NATIONAL_ID' | 'PASSPORT' | 'BIRTH_REGISTRATION_NUMBER'
}

export interface GeneratedPerson {
  name: GeneratedName[]
  birthDate?: string
  ageOfIndividualInYears?: number
  exactDateOfBirthUnknown?: boolean
  nationality: string[]
  identifier: GeneratedIdentifier[]
  address: GeneratedAddress[]
  maritalStatus?: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'SEPARATED'
  educationalAttainment?: 'NO_SCHOOLING' | 'ISCED_1' | 'ISCED_4' | 'ISCED_5'
  occupation?: string
}

export interface GeneratedChild extends GeneratedPerson {
  gender: 'male' | 'female'
}

export interface GeneratedEventLocation {
  type?: 'PRIVATE_HOME' | 'OTHER'
  _fhirID?: string
  address?: {
    line: string[]
    district: string
    state: string
    city: string
    postalCode: string
    country: string
  }
}

export interface GeneratedRegistration {
  informantType:
    | 'MOTHER'
    | 'FATHER'
    | 'BROTHER'
    | 'SISTER'
    | 'GRANDFATHER'
    | 'GRANDMOTHER'
    | 'LEGAL_GUARDIAN'
    | 'OTHER'
  contactPhoneNumber: string
  contactEmail: string
  informantsSignature?: string
  status: Array<{
    timestamp: string
    timeLoggedMS: number
  }>
  draftId: string
}

export interface GeneratedDocuments {
  proofOfBirth?: string
  proofOfMother?: string
  proofOfFather?: string
  proofOfInformant?: string
  proofOther?: string
  proofOfDeceased?: string
  proofOfDeath?: string
  proofOfCauseOfDeath?: string
}

// Data generation constants
const COUNTRIES = ['FAR', 'USA', 'GBR', 'IND', 'KEN', 'UGA']
const STATES = ['Central', 'Northern', 'Southern', 'Eastern', 'Western']
const DISTRICTS = ['Ibombo', 'Sulaka', 'Chuminga', 'Central', 'Nsali']
const CITIES = [
  'Capital City',
  'Regional Town',
  'District Center',
  'Rural Area',
]
const GENDERS = ['male', 'female'] as const
const MARITAL_STATUSES = [
  'SINGLE',
  'MARRIED',
  'DIVORCED',
  'WIDOWED',
  'SEPARATED',
] as const
const EDUCATION_LEVELS = [
  'NO_SCHOOLING',
  'ISCED_1',
  'ISCED_4',
  'ISCED_5',
] as const
const ATTENDANT_TYPES = ['PHYSICIAN', 'NURSE', 'MIDWIFE', 'OTHER'] as const
const BIRTH_TYPES = [
  'SINGLE',
  'TWIN',
  'TRIPLET',
  'QUADRUPLET',
  'HIGHER_MULTIPLE_DELIVERY',
] as const
const INFORMANT_RELATIONS = [
  'MOTHER',
  'FATHER',
  'BROTHER',
  'SISTER',
  'GRANDFATHER',
  'GRANDMOTHER',
  'LEGAL_GUARDIAN',
  'OTHER',
] as const

/**
 * Generate a realistic name
 */
export function generateName(gender?: 'male' | 'female'): GeneratedName {
  const firstName =
    gender === 'male'
      ? faker.person.firstName('male')
      : gender === 'female'
      ? faker.person.firstName('female')
      : faker.person.firstName()

  return {
    use: 'en',
    firstNames: firstName,
    middleName: faker.datatype.boolean(0.3)
      ? faker.person.middleName()
      : undefined,
    familyName: faker.person.lastName(),
  }
}

/**
 * Generate a realistic address
 */
export function generateAddress(): GeneratedAddress {
  const state = faker.helpers.arrayElement(STATES)
  const district = faker.helpers.arrayElement(DISTRICTS)
  const city = faker.helpers.arrayElement(CITIES)

  return {
    type: 'PRIMARY_ADDRESS',
    line: [
      faker.location.buildingNumber(),
      faker.location.street(),
      faker.location.city(),
      '',
      '', // Empty fields as per existing pattern
      faker.helpers.arrayElement(['URBAN', 'RURAL']),
      ...new Array(9).fill(''), // Additional empty fields to match pattern
    ],
    country: faker.helpers.arrayElement(COUNTRIES),
    state,
    partOf: district,
    district,
    city,
    postalCode: faker.location.zipCode(),
  }
}

/**
 * Generate identifiers
 */
export function generateIdentifiers(
  count: number = 1,
  specificType?: GeneratedIdentifier['type']
): GeneratedIdentifier[] {
  const identifierTypes = [
    'NATIONAL_ID',
    'PASSPORT',
    'BIRTH_REGISTRATION_NUMBER',
  ] as const
  const identifiers: GeneratedIdentifier[] = []

  for (let i = 0; i < count; i++) {
    identifiers.push({
      id: faker.string.numeric(10),
      type: specificType || faker.helpers.arrayElement(identifierTypes),
    })
  }

  return identifiers
}

/**
 * Generate a birth date with optional age unknown flag
 */
export function generateBirthInfo(options?: {
  minAge?: number
  maxAge?: number
  allowUnknown?: boolean
}): {
  birthDate?: string
  ageOfIndividualInYears?: number
  exactDateOfBirthUnknown?: boolean
} {
  const { minAge = 18, maxAge = 80, allowUnknown = false } = options || {}

  const isUnknown = allowUnknown && faker.datatype.boolean(0.1)

  if (isUnknown) {
    return {
      ageOfIndividualInYears: faker.number.int({ min: minAge, max: maxAge }),
    }
  }

  const age = faker.number.int({ min: minAge, max: maxAge })
  const birthDate = format(
    subYears(new Date(), age + faker.number.int({ min: 0, max: 365 }) / 365),
    'yyyy-MM-dd'
  )

  return {
    birthDate,
    ageOfIndividualInYears: age,
  }
}

/**
 * Generate a person with all basic information
 */
export function generatePerson(options?: {
  gender?: 'male' | 'female'
  minAge?: number
  maxAge?: number
  includeOptionalFields?: boolean
  identifierType?: GeneratedIdentifier['type']
}): GeneratedPerson {
  const {
    gender,
    minAge,
    maxAge,
    includeOptionalFields = true,
    identifierType,
  } = options || {}
  const birthInfo = generateBirthInfo({ minAge, maxAge, allowUnknown: true })

  const person: GeneratedPerson = {
    name: [generateName(gender)],
    ...birthInfo,
    nationality: [faker.helpers.arrayElement(COUNTRIES)],
    identifier: generateIdentifiers(1, identifierType),
    address: [generateAddress()],
  }

  if (includeOptionalFields) {
    person.maritalStatus = faker.helpers.arrayElement(MARITAL_STATUSES)
    person.educationalAttainment = faker.helpers.arrayElement(EDUCATION_LEVELS)
    person.occupation = faker.person.jobTitle()
  }

  return person
}

/**
 * Generate a child with birth-specific information
 */
export function generateChild(options?: {
  ageInDays?: number
  gender?: 'male' | 'female'
}): GeneratedChild {
  const { ageInDays = faker.number.int({ min: 1, max: 365 }), gender } =
    options || {}
  const childGender = gender || faker.helpers.arrayElement(GENDERS)

  const birthDate = format(subDays(new Date(), ageInDays), 'yyyy-MM-dd')

  return {
    name: [generateName(childGender)],
    birthDate,
    gender: childGender,
    nationality: [faker.helpers.arrayElement(COUNTRIES)],
    identifier: [],
    address: [],
  }
}

/**
 * Generate event location
 */
export async function generateEventLocation(): Promise<GeneratedEventLocation> {
  const locationType = faker.helpers.arrayElement([
    'HEALTH_FACILITY',
    'PRIVATE_HOME',
    'OTHER',
  ])

  if (locationType === 'HEALTH_FACILITY') {
    const locations = await getAllLocations('HEALTH_FACILITY')
    const ids = locations?.map((l: fhir.Location) => l.id) || []
    return {
      _fhirID: faker.helpers.arrayElement(ids),
    }
  }

  const locations = await getAllLocations('ADMIN_STRUCTURE')
  const ids = locations?.map((l: fhir.Location) => l.id) || []

  return {
    type: locationType as 'PRIVATE_HOME' | 'OTHER',
    address: {
      line: [
        faker.location.buildingNumber(),
        faker.location.street(),
        faker.location.city(),
        '',
        '',
        faker.helpers.arrayElement(['URBAN', 'RURAL']),
        ...new Array(9).fill(''),
      ],

      district: faker.helpers.arrayElement(ids),
      state: faker.helpers.arrayElement(ids),
      city: faker.helpers.arrayElement(ids),
      postalCode: faker.location.zipCode(),
      country: faker.helpers.arrayElement(COUNTRIES),
    },
  }
}

/**
 * Generate registration information
 */
export function generateRegistration(): GeneratedRegistration {
  return {
    informantType: faker.helpers.arrayElement(INFORMANT_RELATIONS),
    contactPhoneNumber: '+260' + faker.string.numeric(9),
    contactEmail: faker.internet.email(),
    informantsSignature:
      'data:image/png;base64,' + faker.string.alphanumeric(100),
    status: [
      {
        timestamp: new Date().toISOString(),
        timeLoggedMS: faker.number.int({ min: 100000, max: 2000000 }),
      },
    ],
    draftId: uuidv4(),
  }
}

/**
 * Generate questionnaire responses
 */
export function generateQuestionnaire(eventType: 'birth' | 'death'): {
  questionnaire: Array<{ fieldId: string; value: string }>
  identifierTypes: {
    motherIdType?: GeneratedIdentifier['type']
    fatherIdType?: GeneratedIdentifier['type']
    informantIdType?: GeneratedIdentifier['type']
    deceasedIdType?: GeneratedIdentifier['type']
  }
} {
  const identifierTypes = [
    'NATIONAL_ID',
    'PASSPORT',
    'BIRTH_REGISTRATION_NUMBER',
  ] as const

  if (eventType === 'birth') {
    const motherIdType = faker.helpers.arrayElement(identifierTypes)
    const fatherIdType = faker.helpers.arrayElement(identifierTypes)
    const informantIdType = faker.helpers.arrayElement(identifierTypes)

    return {
      questionnaire: [
        {
          fieldId: 'birth.mother.mother-view-group.motherIdType',
          value: motherIdType,
        },
        {
          fieldId: 'birth.father.father-view-group.fatherIdType',
          value: fatherIdType,
        },
        {
          fieldId: 'birth.informant.informant-view-group.informantIdType',
          value: informantIdType,
        },
      ],
      identifierTypes: {
        motherIdType,
        fatherIdType,
        informantIdType,
      },
    }
  }

  const informantIdType = faker.helpers.arrayElement(identifierTypes)
  const deceasedIdType = faker.helpers.arrayElement(identifierTypes)

  return {
    questionnaire: [
      {
        fieldId: 'death.informant.informant-view-group.informantIdType',
        value: informantIdType,
      },
      {
        fieldId: 'death.deceased.deceased-view-group.deceasedIdType',
        value: deceasedIdType,
      },
    ],
    identifierTypes: {
      informantIdType,
      deceasedIdType,
    },
  }
}

/**
 * Generate a complete birth registration
 */
export async function generateBirthRegistration(options?: {
  childAge?: number
  motherAge?: number
  fatherAge?: number
  informantType?: (typeof INFORMANT_RELATIONS)[number]
}) {
  const {
    childAge = faker.number.int({ min: 1, max: 30 }),
    motherAge = faker.number.int({ min: 18, max: 45 }),
    fatherAge = faker.number.int({ min: 20, max: 50 }),
    informantType,
  } = options || {}

  // Generate questionnaire first to get identifier types
  const { questionnaire, identifierTypes } = generateQuestionnaire('birth')

  const child = generateChild({ ageInDays: childAge })
  const mother = generatePerson({
    gender: 'female',
    minAge: motherAge - 2,
    maxAge: motherAge + 2,
    identifierType: identifierTypes.motherIdType,
  })
  const father = generatePerson({
    gender: 'male',
    minAge: fatherAge - 2,
    maxAge: fatherAge + 2,
    identifierType: identifierTypes.fatherIdType,
  })
  const informant = generatePerson({
    identifierType: identifierTypes.informantIdType,
  })

  const registration = generateRegistration()
  if (informantType) {
    registration.informantType = informantType
  }

  return {
    createdAt: new Date().toISOString(),
    registration,
    child,
    mother: {
      ...mother,
      detailsExist: true,
      multipleBirth: faker.number.int({ min: 1, max: 4 }),
    },
    father: {
      ...father,
      detailsExist: faker.datatype.boolean(0.9),
      reasonNotApplying: faker.datatype.boolean(0.1)
        ? 'Father unknown'
        : undefined,
    },
    informant,
    eventLocation: await generateEventLocation(),
    attendantAtBirth: faker.helpers.arrayElement(ATTENDANT_TYPES),
    birthType: faker.helpers.arrayElement(BIRTH_TYPES),
    weightAtBirth: faker.number.float({
      min: 1.5,
      max: 5.5,
      fractionDigits: 1,
    }),
    questionnaire,
  }
}

/**
 * Generate death event details
 */
export function generateDeathEventDetails() {
  const deathDate = format(
    subDays(new Date(), faker.number.int({ min: 1, max: 365 })),
    'yyyy-MM-dd'
  )

  return {
    deathDate,
    mannerOfDeath: faker.helpers.arrayElement([
      'NATURAL',
      'ACCIDENT',
      'SUICIDE',
      'HOMICIDE',
      'PENDING_INVESTIGATION',
      'COULD_NOT_BE_DETERMINED',
    ]),
    causeOfDeathEstablished: faker.datatype.boolean(0.8),
    causeOfDeathMethod: faker.helpers.arrayElement([
      'PHYSICIAN',
      'LAY_REPORTED',
      'VERBAL_AUTOPSY',
      'MEDICALLY_CERTIFIED',
    ]),
    deathDescription: faker.lorem.sentence(),
    reasonForLateRegistration: faker.datatype.boolean(0.2)
      ? faker.lorem.sentence()
      : undefined,
  }
}

/**
 * Generate a complete death registration
 */
export function generateDeathRegistration(options?: {
  deceasedAge?: number
  informantType?: (typeof INFORMANT_RELATIONS)[number]
  includeSpouse?: boolean
}) {
  const {
    deceasedAge = faker.number.int({ min: 1, max: 100 }),
    informantType,
    includeSpouse = faker.datatype.boolean(0.7),
  } = options || {}

  // Generate questionnaire first to get identifier types
  const { questionnaire, identifierTypes } = generateQuestionnaire('death')

  const deceased = generatePerson({
    minAge: deceasedAge - 2,
    maxAge: deceasedAge + 2,
    includeOptionalFields: true,
    identifierType: identifierTypes.deceasedIdType,
  })

  const informant = generatePerson({
    identifierType: identifierTypes.informantIdType,
  })
  const eventDetails = generateDeathEventDetails()

  const registration = generateRegistration()
  if (informantType) {
    registration.informantType = informantType
  }

  const deathRegistration: any = {
    createdAt: new Date().toISOString(),
    registration,
    deceased: {
      ...deceased,
      deceased: { deathDate: eventDetails.deathDate },
      numberOfDependants: faker.number.int({ min: 0, max: 8 }),
    },
    informant,
    eventLocation: generateEventLocation(),
    ...eventDetails,
    questionnaire,
  }

  if (includeSpouse && deceased.maritalStatus === 'MARRIED') {
    deathRegistration.spouse = {
      ...generatePerson({ includeOptionalFields: true }),
      detailsExist: true,
    }
  }

  return deathRegistration
}

/**
 * Helper to generate data matching specific field mappings
 */
export function generateDataForFieldMapping(
  fieldMapping: Record<string, string>
) {
  const data: any = {}

  Object.keys(fieldMapping).forEach((sourceField) => {
    const targetField = fieldMapping[sourceField]

    // Generate appropriate data based on target field type
    if (targetField.includes('name')) {
      data[sourceField] = generateName()
    } else if (targetField.includes('address')) {
      data[sourceField] = generateAddress()
    } else if (targetField.includes('dob') || targetField.includes('date')) {
      data[sourceField] = format(faker.date.past(), 'yyyy-MM-dd')
    } else if (targetField.includes('phone')) {
      data[sourceField] = '+260' + faker.string.numeric(9)
    } else if (targetField.includes('email')) {
      data[sourceField] = faker.internet.email()
    } else {
      data[sourceField] = faker.lorem.word()
    }
  })

  return data
}
