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

export function isValidDate(dateStr: string): boolean {
  // Allow yyyy-m-d OR yyyy-mm-dd
  const regex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
  const match = dateStr.match(regex);

  if (!match) return false;

  const [, yearStr, monthStr, dayStr] = match;

  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  // Month must be 1–12
  if (month < 1 || month > 12) return false;

  // Get correct number of days in the month (handles leap years)
  const daysInMonth = new Date(year, month, 0).getDate();

  return day >= 1 && day <= daysInMonth;
}



export function isDateField(fieldId: string): boolean {
  const dateFieldPatterns = ['BirthDate', 'birthDate', 'Date', 'deathDate']
  return dateFieldPatterns.some((pattern) => fieldId.includes(pattern))
}
