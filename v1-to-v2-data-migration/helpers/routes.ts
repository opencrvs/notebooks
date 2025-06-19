const domain = Deno?.args?.[1] || 'localhost'
export const CONFIG = `http://${
  domain.includes('localhost') ? `${domain}:2021` : `config.${domain}`
}`
export const GATEWAY = `http://${
  domain.includes('localhost') ? `${domain}:7070` : `gateway.${domain}`
}`
export const COUNTRY_CONFIG = `http://${
  domain.includes('localhost') ? `${domain}:3040` : `gateway.${domain}`
}`
