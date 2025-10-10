// @ts-nocheck - Using Deno-specific environment variables
export const DOMAIN = Deno?.env?.get('OPENCRVS_DOMAIN') || 'localhost'
export const EVENT = Deno?.env?.get('OPENCRVS_EVENT') || 'birth'
export const CLIENT_ID = Deno?.env?.get('OPENCRVS_CLIENT_ID')
export const CLIENT_SECRET = Deno?.env?.get('OPENCRVS_CLIENT_SECRET')
export const ADMIN_USERNAME =
  Deno?.env?.get('OPENCRVS_ADMIN_USERNAME') || 'j.campbell'
export const ADMIN_PASSWORD =
  Deno?.env?.get('OPENCRVS_ADMIN_PASSWORD') || 'test'
export const REGISTRAR_USERNAME =
  Deno?.env?.get('OPENCRVS_REGISTRAR_USERNAME') || 'k.mweene'
export const REGISTRAR_PASSWORD =
  Deno?.env?.get('OPENCRVS_REGISTRAR_PASSWORD') || 'test'
