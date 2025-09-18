import {
  Identifier,
  Document,
  ProcessedDocument,
  Address,
  Name,
  AddressLine,
} from './types.ts'

// TODO How will this work for Uganda's location levels?
export function convertAddress(
  address: AddressLine | undefined
): Address | null {
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
        /* For potential custom field
        kebele: getCustomField(data, 'birth.child.address.kebele'),
         */
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

export const getIdentifier = (
  data: { identifier?: Identifier[] } | undefined,
  identifier: string
): string | undefined =>
  data?.identifier?.find(({ type }) => type === identifier)?.id

export const getDocuments = (
  data: any,
  type: string
): ProcessedDocument[] | null => {
  const documents = data?.registration?.attachments
    ?.filter(({ subject }: { subject: string }) => subject === type)
    ?.map((doc: Document): ProcessedDocument => {
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
export const getName = (name: Name | undefined): Name | null =>
  name
    ? {
        firstname: name?.firstNames,
        middleName: name?.middleName,
        surname: name?.familyName,
        /* For potential custom field
        grandfatherName: getCustomField(data, 'birth.child.grandfatherName'),
         */
      }
    : null

export function getCustomField(data: any, id: string): any {
  return data?.questionnaire?.find(
    ({ fieldId }: { fieldId: string }) => fieldId === id
  )?.value
}
