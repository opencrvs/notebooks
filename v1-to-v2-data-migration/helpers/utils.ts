export const extractFieldType = (obj, fieldName) => {
  const fields = []

  function recurse(value) {
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

export const extractFormFields = (form, formName) =>
  form[formName].sections
    .map((section) =>
      section.groups.flatMap((g) =>
        g.fields.map((f) => ({ ...f, id: `${formName}.${g.id}.${f.name}` }))
      )
    )
    .flatMap((x) => x)
