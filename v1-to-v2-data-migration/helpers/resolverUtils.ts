import { Identifier, Document, ProcessedDocument } from './types.ts'

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
  const field = data?.questionnaire?.find(
    ({ fieldId }: { fieldId: string }) => fieldId === id
  )

  if (!field) return undefined

  if (field.value === "true") return true
  if (field.value === "false") return false

  return field.value
}