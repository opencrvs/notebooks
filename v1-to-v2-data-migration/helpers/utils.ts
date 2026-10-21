import { FormCollection, FormFieldWithId } from './types.ts'

export const extractFieldType = (obj: any, fieldName: string): unknown[] => {
  const fields: unknown[] = []

  function recurse(value: unknown): void {
    if (Array.isArray(value)) {
      value.forEach((item) => recurse(item))
    } else if (value !== null && typeof value === 'object') {
      for (const [key, val] of Object.entries(value)) {
        if (key === fieldName) {
          fields.push(val)
        }
        recurse(val)
      }
    }
  }

  recurse(obj)
  return fields.flatMap((x) => x)
}

export const extractFormFields = (
  form: FormCollection,
  formName: string | number
): FormFieldWithId[] =>
  form[formName].sections
    .map((section) =>
      section.groups.flatMap((group) =>
        group.fields.map((field) => ({
          ...field,
          id:
            field.customQuestionMappingId ||
            `${formName}.${section.id}.${field.name}`,
        }))
      )
    )
    .flatMap((x) => x)

export function batch<T>(items: T[], batchSize: number): T[][] {
  if (batchSize <= 0) {
    throw new Error('batchSize must be greater than 0')
  }

  const batches: T[][] = []
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize))
  }
  return batches
}

type IndexResult = {
  result: {
    data: {
      json: {
        errors: any
        items: any[]
      }
    }
  }
}

export const getIndexErrors = (
  indexResult: IndexResult
): string[] | undefined => {
  if (indexResult.result?.data?.json?.errors) {
    return indexResult.result.data.json.items
      ?.filter((x: { index: { error: any } }) => x.index?.error)
      .map((x: { index: { error: { reason: any } } }) => x.index.error.reason)
  }
}
