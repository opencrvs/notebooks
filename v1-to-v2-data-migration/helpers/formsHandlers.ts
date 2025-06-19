import { CONFIG, COUNTRY_CONFIG } from './routes.ts'

export const fetchForms = async (token) => {
  const response = await fetch(`${CONFIG}/forms`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error(`Form fetching: ${response.statusText}`)
  }

  return await response.json()
}

export const fetchEvents = async (token) => {
  const response = await fetch(`${COUNTRY_CONFIG}/events`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error(`Events fetching: ${response.statusText}`)
  }

  return await response.json()
}
