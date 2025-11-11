import { Identifier, Document, ProcessedDocument, PersonWithIdentifiers } from './types.ts'

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

export function getCustomField(data: any, id: string): any {
  return data?.questionnaire?.find(
    ({ fieldId }: { fieldId: string }) => fieldId === id
  )?.value
}


/**
 * Special informants have their own special sections like `mother.`, `father.` or `spouse.`.
 */
export const isSpecialInformant = (informant?: PersonWithIdentifiers) => {
  if (!informant) return false

  return informant.relationship === 'SPOUSE'
    || informant.relationship === 'MOTHER'
    || informant.relationship === 'FATHER'
}