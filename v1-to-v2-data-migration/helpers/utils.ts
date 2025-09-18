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
