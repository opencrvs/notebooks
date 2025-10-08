import { DOMAIN } from './vars.ts'

export const CONFIG = `http://${
  DOMAIN.includes('localhost') ? `${DOMAIN}:2021` : `config.${DOMAIN}`
}`
export const GATEWAY = `http://${
  DOMAIN.includes('localhost') ? `${DOMAIN}:7070` : `gateway.${DOMAIN}`
}`
export const COUNTRY_CONFIG = `http://${
  DOMAIN.includes('localhost') ? `${DOMAIN}:3040` : `countryconfig.${DOMAIN}`
}`

export const REGISTER_APP = `http://${
  DOMAIN.includes('localhost') ? `${DOMAIN}:3000` : `register.${DOMAIN}`
}`

export const API = `http://${
  DOMAIN.includes('localhost') ? `${DOMAIN}:3000/api` : `${DOMAIN}/api`
}`
