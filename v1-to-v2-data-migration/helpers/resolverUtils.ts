import { Identifier, Document, ProcessedDocumentWithOptionType, PersonWithIdentifiers, ProcessedDocument } from './types.ts'

export const getIdentifier = (
  data: { identifier?: Identifier[] } | undefined,
  identifier: string
): string | undefined =>
  data?.identifier?.find(({ type }) => type === identifier)?.id

export const getDocument = (
  data: any,
  type: string
): ProcessedDocument[] | null => {
  const document = data?.registration?.attachments
    ?.filter(({ subject }: { subject: string }) => subject === type)
    ?.map((doc: Document): ProcessedDocument => {
      return {
        path: doc.uri,
        originalFilename: doc.uri.replace('/ocrvs/', ''),
        type: doc.contentType
      }
    })[0]
  if (!document) {
    return null
  }
  return document
}
export const getDocuments = (
  data: any,
  type: string
): ProcessedDocumentWithOptionType[] | null => {
  const documents = data?.registration?.attachments
    ?.filter(({ subject }: { subject: string }) => subject === type)
    ?.map((doc: Document): ProcessedDocumentWithOptionType => {
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

export function getCustomField(data: any, id: string): any {
  const field = data?.questionnaire?.find(
    ({ fieldId }: { fieldId: string }) => fieldId === id
  )

  if (!field) return undefined

  if (field.value === "true") return true
  if (field.value === "false") return false

  return field.value

}


/**
 * Special informants have their own special sections like `mother.`, `father.` or `spouse.`.
 */
export const isSpecialInformant = (informant: PersonWithIdentifiers | undefined, eventType: 'birth' | 'death') => {
  if (!informant) return false

  if(eventType === 'birth') {
    return informant.relationship === 'MOTHER'
    || informant.relationship === 'FATHER'
  }

  if(eventType === 'death') {
    return informant.relationship === 'SPOUSE'
  }
  return false
}