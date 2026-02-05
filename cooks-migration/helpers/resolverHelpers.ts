export const toCrvsDate = (dateString: string): string => {
  const [month, day, year] = dateString.split('/').map(Number)
  if (!month || !day || !year) return ''

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}
