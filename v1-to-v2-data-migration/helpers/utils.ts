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
  return fields
}
