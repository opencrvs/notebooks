// @ts-nocheck - Using Deno-specific environment variables
export const DOMAIN =
  Deno?.env?.get('OPENCRVS_DOMAIN') || 'farajaland-staging.opencrvs.org'
export const EVENT = Deno?.env?.get('OPENCRVS_EVENT') || 'birth'
export const CLIENT_ID =
  Deno?.env?.get('OPENCRVS_CLIENT_ID') || 'c0551f3c-8c28-4d67-954f-ca836d1ba109'
export const CLIENT_SECRET =
  Deno?.env?.get('OPENCRVS_CLIENT_SECRET') ||
  'e6d8c116-83fb-4a06-9857-7e0f2a405f23'
