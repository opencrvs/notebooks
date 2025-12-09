/**
 * @example
 * normalizeDateString('2025-3-3') // returns '2025-03-03'
 */
export function normalizeDateString(
  dateStr: string | undefined
): string | undefined {
  if (!dateStr) {
    return dateStr
  }

  const datePattern = /^(\d{4})-(\d{1,2})-(\d{1,2})$/
  const match = dateStr?.toString().match(datePattern)

  if (!match) {
    return dateStr
  }

  const [, year, month, day] = match

  const paddedMonth = month.padStart(2, '0')
  const paddedDay = day.padStart(2, '0')

  return `${year}-${paddedMonth}-${paddedDay}`
}

export function isDateField(fieldId: string): boolean {
  const dateFieldPatterns = ['BirthDate', 'birthDate', 'Date', 'deathDate']
  return dateFieldPatterns.some((pattern) => fieldId.includes(pattern))
}
