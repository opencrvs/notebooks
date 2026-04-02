import { GATEWAY } from './routes.ts'

export const getLocations = async (
  token: string,
  type: 'ADMIN_STRUCTURE' | 'HEALTH_FACILITY' | 'CRVS_OFFICE'
) => {
  const response = await fetch(
    `${GATEWAY}/location?type=${type}&_count=0&status=active`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Connection: 'close'
      },
      keepalive: false
    }
  )
  if (!response.ok) {
    throw new Error(`Sync Locations failed: ${response.statusText}`)
  }
  return response
}
