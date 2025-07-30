// TODO How will this work for Uganda's location levels?
export function convertAddress(address) {
  if (!address) {
    return null
  }
  const international = address.country !== 'FAR' //This doesn't work for other countries
  if (international) {
    return {
      addressType: 'INTERNATIONAL',
      country: address.country,
      state: address.state,
      district2: address.district,
      cityOrTown: address.city,
      addressLine1: address.line.filter(Boolean)[0],
      addressLine2: address.line.filter(Boolean)[1],
      addressLine3: address.line.filter(Boolean).slice(2).join(', '),
      postcodeOrZip: address.postalCode,
    }
  }

  const rural = address.line.some((line) => line === 'RURAL')

  if (rural) {
    return {
      addressType: 'DOMESTIC',
      urbanOrRural: 'RURAL',
      country: address.country,
      province: address.state,
      district: address.district,
      village: address.line.find((line) => line.trim() !== ''),
      addressLine1: address.line.filter(Boolean)[0],
      addressLine2: address.line.filter(Boolean)[1],
      addressLine3: address.line.filter(Boolean).slice(2).join(', '),
    }
  }

  return {
    addressType: 'DOMESTIC',
    urbanOrRural: 'URBAN',
    country: address.country,
    province: address.state,
    district: address.district,
    town: address.city,
    addressLine1: address.line.filter(Boolean)[0],
    addressLine2: address.line.filter(Boolean)[1],
    addressLine3: address.line.filter(Boolean).slice(2).join(', '),
    zipCode: address.postalCode,
  }
}

export const getIdentifier = (data, identifier) =>
  data?.identifier?.find(({ type }) => type === identifier)?.id

export const getDocuments = (data, type) => {
  const documents = data.registration.attachments
    ?.filter(({ subject }) => subject === type)
    ?.map((doc) => ({
      filename: doc.uri.replace('/ocrvs/', ''),
      originalFilename: doc.uri.replace('/ocrvs/', ''),
      type: doc.contentType,
      option: doc.type,
    }))
  if (!documents?.length) {
    return null
  }
  return documents[0]
}

// What about custom fields
export const getName = (name) => ({
  firstname: name?.firstNames,
  middleName: name?.middleName,
  surname: name?.familyName,
})

export function getCustomField(data, id) {
  return data.questionnaire.find(({ fieldId }) => fieldId === id)?.value
}
