export const countryResolver = {}

// The V1 response will populate both the informant and special informant fields
// so we need to check if the informant is a special informant to avoid duplication
export const birthSpecialInformants = ['MOTHER', 'FATHER']
export const deathSpecialInformants = ['SPOUSE']
