import { DOMAIN } from './vars.ts'

export const CONFIG = `https://${
  DOMAIN.includes('localhost') ? `${DOMAIN}:2021` : `config.${DOMAIN}`
}`
export const GATEWAY = `https://${
  DOMAIN.includes('localhost') ? `${DOMAIN}:7070` : `gateway.${DOMAIN}`
}`
export const AUTH = `http://${
  DOMAIN.includes('localhost') ? `${DOMAIN}:7070` : `auth.${DOMAIN}`
}`
export const COUNTRY_CONFIG = `https://${
  DOMAIN.includes('localhost') ? `${DOMAIN}:3040` : `countryconfig.${DOMAIN}`
}`

export const REGISTER_APP = `https://${
  DOMAIN.includes('localhost') ? `${DOMAIN}:3000` : `register.${DOMAIN}`
}`

export const API = `https://${
  DOMAIN.includes('localhost') ? `${DOMAIN}:3000/api` : `${DOMAIN}/api`
}`
