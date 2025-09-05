import { GATEWAY } from './helpers/routes.ts'

export async function authenticate(
  gatewayUrl: string,
  username: string,
  password: string
): Promise<{ nonce: string }> {
  const response = await fetch(`${gatewayUrl}/auth/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.statusText}`)
  }
  const authResponse = await response.json()

  const nonce = authResponse.nonce
  const verifyCode = async (code: string, nonce: string) => {
    const response = await fetch(`${GATEWAY}/auth/verifyCode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, nonce }),
    })
    if (!response.ok) {
      throw new Error(`Code verification failed: ${response.statusText}`)
    }
    return response.json()
  }

  return (await verifyCode('000000', nonce)).token
}
