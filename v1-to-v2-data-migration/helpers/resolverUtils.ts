// TODO How will this work for Uganda's location levels?
export function convertAddress(address: any) {
  if (!address) {
    return null
  }
  const international = address.country !== 'FAR' //This doesn't work for other countries
  if (international) {
    return {
      addressType: 'INTERNATIONAL',
      country: address.country,
      streetLevelDetails: {
        state: address.state,
        district2: address.district,
        cityOrTown: address.city,
        addressLine1: address.line.filter(Boolean)[0],
        addressLine2: address.line.filter(Boolean)[1],
        addressLine3: address.line.filter(Boolean).slice(2).join(', '),
        postcodeOrZip: address.postalCode,
      },
    }
  }

  return {
    addressType: 'DOMESTIC',
    country: address.country,
    administrativeArea: address.district,
    streetLevelDetails: {
      town: address.city,
      number: address.line.filter(Boolean)[0],
      street: address.line.filter(Boolean)[1],
      residentialArea: address.line.filter(Boolean)[2],
      zipCode: address.postalCode,
    },
  }
}

export const getIdentifier = (data, identifier) =>
  data?.identifier?.find(({ type }) => type === identifier)?.id

export const getDocuments = (data, type) => {
  const documents = data.registration.attachments
    ?.filter(({ subject }) => subject === type)
    ?.map((doc) => {
      return {
        path: doc.uri,
        originalFilename: doc.uri.replace('/ocrvs/', ''),
        type: doc.contentType,
        option: doc.type,
      }
    })
  if (!documents?.length) {
    return null
  }
  return documents
}

// What about custom fields
export const getName = (name: any) =>
  name && {
    firstname: name?.firstNames,
    middleName: name?.middleName,
    surname: name?.familyName,
  }

export function getCustomField(data: any, id: string) {
  return data.questionnaire.find(({ fieldId }) => fieldId === id)?.value
}
