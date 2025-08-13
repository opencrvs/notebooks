import { GATEWAY } from './routes.ts'

export const registerSystem = async (token) => {
  const response = await fetch(`${GATEWAY}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      operationName: 'registerSystem',
      variables: {
        system: {
          type: 'IMPORT',
          name: 'Import',
        },
      },
      query: `mutation registerSystem($system: SystemInput) {
        registerSystem(system: $system) {
          clientSecret
          system {
            _id
            clientId
            name
            shaSecret
            status
            type
            integratingSystemType
            settings {
              webhook {
                event
                permissions
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
      }`,
    }),
  })

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`)
  }
  return response.json()
}

const GetRegistrationsList = async (token, event) => {
  const searchSet =
    event === 'birth' ? 'BirthEventSearchSet' : 'DeathEventSearchSet'
  const response = await fetch(`${GATEWAY}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      operationName: 'GetRegistrationsListByFilter',
      query: `query GetRegistrationsListByFilter {
  searchEvents(advancedSearchParameters: { event: ${event} }, count: 10000) {
    results {
      ... on ${searchSet} {
        id
      }
    }
  }
}`,
    }),
  })
  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`)
  }
  return response.json()
}

export const fetchAllBirthRegistrations = async (token) => {
  return await GetRegistrationsList(token, 'birth')
}

export const fetchAllDeathRegistrations = async (token) => {
  return await GetRegistrationsList(token, 'death')
}

export const fetchBirthRegistration = async (recordId, token) => {
  const response = await fetch(`${GATEWAY}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      operationName: 'fetchBirthRegistrationForReview',
      variables: {
        id: recordId,
      },
      query: `query fetchBirthRegistrationForReview($id: ID!) {
  fetchBirthRegistration(id: $id) {
    _fhirIDMap
    id
    child {
      id
      identifier {
        id
        type
        otherType
        __typename
      }
      name {
        use
        firstNames
        middleName
        familyName
        __typename
      }
      birthDate
      gender
      __typename
    }
    informant {
      id
      relationship
      otherRelationship
      _fhirIDPatient
      identifier {
        id
        type
        otherType
        fieldsModifiedByIdentity
        __typename
      }
      name {
        use
        firstNames
        middleName
        familyName
        __typename
      }
      occupation
      nationality
      birthDate
      ageOfIndividualInYears
      exactDateOfBirthUnknown
      address {
        type
        line
        district
        state
        city
        postalCode
        country
        __typename
      }
      __typename
    }
    mother {
      id
      name {
        use
        firstNames
        middleName
        familyName
        __typename
      }
      multipleBirth
      birthDate
      maritalStatus
      occupation
      detailsExist
      reasonNotApplying
      ageOfIndividualInYears
      exactDateOfBirthUnknown
      dateOfMarriage
      educationalAttainment
      nationality
      identifier {
        id
        type
        otherType
        fieldsModifiedByIdentity
        __typename
      }
      address {
        type
        line
        district
        state
        city
        postalCode
        country
        __typename
      }
      telecom {
        system
        value
        __typename
      }
      __typename
    }
    father {
      id
      name {
        use
        firstNames
        middleName
        familyName
        __typename
      }
      birthDate
      maritalStatus
      occupation
      detailsExist
      reasonNotApplying
      ageOfIndividualInYears
      exactDateOfBirthUnknown
      dateOfMarriage
      educationalAttainment
      nationality
      identifier {
        id
        type
        otherType
        fieldsModifiedByIdentity
        __typename
      }
      address {
        type
        line
        district
        state
        city
        postalCode
        country
        __typename
      }
      telecom {
        system
        value
        __typename
      }
      __typename
    }
    registration {
      id
      informantType
      otherInformantType
      contact
      contactRelationship
      contactPhoneNumber
      contactEmail
      assignment {
        practitionerId
        firstName
        lastName
        officeName
        avatarURL
        __typename
      }
      certificates {
        hasShowedVerifiedDocument
        certificateTemplateId
        collector {
          relationship
          otherRelationship
          name {
            use
            firstNames
            familyName
            __typename
          }
          telecom {
            system
            value
            use
            __typename
          }
          __typename
        }
        __typename
      }
      duplicates {
        compositionId
        trackingId
        __typename
      }
      informantsSignature
      attachments {
        data
        uri
        type
        contentType
        subject
        __typename
      }
      status {
        comments {
          comment
          __typename
        }
        type
        timestamp
        office {
          name
          alias
          address {
            district
            state
            __typename
          }
          partOf
          __typename
        }
        __typename
      }
      type
      trackingId
      registrationNumber
      __typename
    }
    attendantAtBirth
    weightAtBirth
    birthType
    eventLocation {
      id
      type
      address {
        line
        district
        state
        city
        postalCode
        country
        __typename
      }
      __typename
    }
    questionnaire {
      fieldId
      value
      __typename
    }
    history {
      id
      otherReason
      requester
      requesterOther
      noSupportingDocumentationRequired
      hasShowedVerifiedDocument
      certificateTemplateId
      date
      action
      regStatus
      dhis2Notification
      ipAddress
      documents {
        id
        data
        uri
        type
        __typename
      }
      payment {
        id
        type
        amount
        outcome
        date
        attachmentURL
        __typename
      }
      statusReason {
        text
        __typename
      }
      reason
      location {
        id
        name
        __typename
      }
      office {
        id
        name
        alias
        address {
          state
          district
          __typename
        }
        __typename
      }
      system {
        name
        type
        __typename
      }
      user {
        id
        role {
          id
          label {
            id
            defaultMessage
            description
            __typename
          }
          __typename
        }
        primaryOffice {
          id
          __typename
        }
        name {
          firstNames
          familyName
          use
          __typename
        }
        avatar {
          data
          type
          __typename
        }
        fullHonorificName
        __typename
      }
      signature {
        data
        type
        __typename
      }
      comments {
        user {
          id
          username
          avatar {
            data
            type
            __typename
          }
          __typename
        }
        comment
        createdAt
        __typename
      }
      input {
        valueCode
        valueId
        value
        __typename
      }
      output {
        valueCode
        valueId
        value
        __typename
      }
      certificates {
        hasShowedVerifiedDocument
        certificateTemplateId
        collector {
          relationship
          otherRelationship
          name {
            use
            firstNames
            familyName
            __typename
          }
          telecom {
            system
            value
            use
            __typename
          }
          __typename
        }
        certifier {
          name {
            use
            firstNames
            familyName
            __typename
          }
          role {
            id
            label {
              id
              defaultMessage
              description
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      duplicateOf
      potentialDuplicates
      __typename
    }
    __typename
  }
}

`,
    }),
  })

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`)
  }
  return response.json()
}

export const fetchDeathRegistration = async (recordId, token) => {
  const response = await fetch(`${GATEWAY}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      operationName: 'fetchDeathRegistrationForReview',
      variables: {
        id: recordId,
      },
      query: `query fetchDeathRegistrationForReview($id: ID!) {
  fetchDeathRegistration(id: $id) {
    _fhirIDMap
    id
    deceased {
      id
      name {
        use
        firstNames
        middleName
        familyName
        __typename
      }
      birthDate
      age
      ageOfIndividualInYears
      exactDateOfBirthUnknown
      gender
      maritalStatus
      occupation
      nationality
      identifier {
        id
        type
        otherType
        __typename
      }
      gender
      deceased {
        deathDate
        __typename
      }
      address {
        type
        line
        district
        state
        city
        postalCode
        country
        __typename
      }
      __typename
    }
    informant {
      id
      relationship
      otherRelationship
      _fhirIDPatient
      identifier {
        id
        type
        otherType
        __typename
      }
      name {
        use
        firstNames
        middleName
        familyName
        __typename
      }
      nationality
      occupation
      birthDate
      ageOfIndividualInYears
      exactDateOfBirthUnknown
      telecom {
        system
        value
        __typename
      }
      address {
        type
        line
        district
        state
        city
        postalCode
        country
        __typename
      }
      __typename
    }
    father {
      id
      name {
        use
        firstNames
        middleName
        familyName
        __typename
      }
      birthDate
      maritalStatus
      occupation
      detailsExist
      reasonNotApplying
      ageOfIndividualInYears
      exactDateOfBirthUnknown
      dateOfMarriage
      educationalAttainment
      nationality
      identifier {
        id
        type
        otherType
        fieldsModifiedByIdentity
        __typename
      }
      address {
        type
        line
        district
        state
        city
        postalCode
        country
        __typename
      }
      telecom {
        system
        value
        __typename
      }
      __typename
    }
    mother {
      id
      name {
        use
        firstNames
        middleName
        familyName
        __typename
      }
      birthDate
      maritalStatus
      occupation
      detailsExist
      reasonNotApplying
      ageOfIndividualInYears
      exactDateOfBirthUnknown
      dateOfMarriage
      educationalAttainment
      nationality
      identifier {
        id
        type
        otherType
        fieldsModifiedByIdentity
        __typename
      }
      address {
        type
        line
        district
        state
        city
        postalCode
        country
        __typename
      }
      telecom {
        system
        value
        __typename
      }
      __typename
    }
    spouse {
      id
      name {
        use
        firstNames
        middleName
        familyName
        __typename
      }
      birthDate
      maritalStatus
      occupation
      detailsExist
      reasonNotApplying
      ageOfIndividualInYears
      exactDateOfBirthUnknown
      dateOfMarriage
      educationalAttainment
      nationality
      identifier {
        id
        type
        otherType
        fieldsModifiedByIdentity
        __typename
      }
      address {
        type
        line
        district
        state
        city
        postalCode
        country
        __typename
      }
      telecom {
        system
        value
        __typename
      }
      __typename
    }
    medicalPractitioner {
      name
      qualification
      lastVisitDate
      __typename
    }
    registration {
      id
      contact
      informantType
      otherInformantType
      contactRelationship
      contactPhoneNumber
      contactEmail
      assignment {
        practitionerId
        firstName
        lastName
        officeName
        avatarURL
        __typename
      }
      certificates {
        hasShowedVerifiedDocument
        certificateTemplateId
        collector {
          relationship
          otherRelationship
          name {
            use
            firstNames
            familyName
            __typename
          }
          telecom {
            system
            value
            use
            __typename
          }
          __typename
        }
        __typename
      }
      duplicates {
        compositionId
        trackingId
        __typename
      }
      informantsSignature
      attachments {
        data
        uri
        type
        contentType
        subject
        __typename
      }
      status {
        comments {
          comment
          __typename
        }
        type
        timestamp
        office {
          name
          alias
          address {
            district
            state
            __typename
          }
          partOf
          __typename
        }
        __typename
      }
      type
      trackingId
      registrationNumber
      __typename
    }
    eventLocation {
      id
      type
      address {
        type
        line
        district
        state
        city
        postalCode
        country
        __typename
      }
      __typename
    }
    questionnaire {
      fieldId
      value
      __typename
    }
    mannerOfDeath
    causeOfDeathEstablished
    causeOfDeathMethod
    causeOfDeath
    deathDescription
    maleDependentsOfDeceased
    femaleDependentsOfDeceased
    history {
      documents {
        id
        data
        uri
        type
        __typename
      }
      payment {
        id
        type
        amount
        outcome
        date
        attachmentURL
        __typename
      }
      otherReason
      requester
      requesterOther
      hasShowedVerifiedDocument
      certificateTemplateId
      noSupportingDocumentationRequired
      date
      action
      regStatus
      dhis2Notification
      ipAddress
      statusReason {
        text
        __typename
      }
      reason
      location {
        id
        name
        __typename
      }
      office {
        id
        name
        alias
        address {
          state
          district
          __typename
        }
        __typename
      }
      system {
        name
        type
        __typename
      }
      user {
        id
        role {
          id
          label {
            id
            defaultMessage
            description
            __typename
          }
          __typename
        }
        primaryOffice {
          id
          __typename
        }
        name {
          firstNames
          familyName
          use
          __typename
        }
        avatar {
          data
          type
          __typename
        }
        fullHonorificName
        __typename
      }
      signature {
        data
        type
        __typename
      }
      comments {
        user {
          id
          username
          avatar {
            data
            type
            __typename
          }
          __typename
        }
        comment
        createdAt
        __typename
      }
      input {
        valueCode
        valueId
        value
        __typename
      }
      output {
        valueCode
        valueId
        value
        __typename
      }
      certificates {
        hasShowedVerifiedDocument
        certificateTemplateId
        collector {
          relationship
          otherRelationship
          name {
            use
            firstNames
            familyName
            __typename
          }
          telecom {
            system
            value
            use
            __typename
          }
          __typename
        }
        certifier {
          name {
            use
            firstNames
            familyName
            __typename
          }
          role {
            id
            label {
              id
              defaultMessage
              description
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      duplicateOf
      potentialDuplicates
      __typename
    }
    __typename
  }
}

`,
    }),
  })

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`)
  }
  return response.json()
}
