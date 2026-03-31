import { getCustomField, getDocuments } from '../helpers/resolverUtils.ts'
import { EventRegistration } from '../helpers/types.ts'

export const countryResolver = {
    'child.changedName': (data: EventRegistration) =>
    getCustomField(data, 'birth.child.child-view-group.changedName')
}

// The V1 response will populate both the informant and special informant fields
// so we need to check if the informant is a special informant to avoid duplication
export const birthSpecialInformants = ['MOTHER', 'FATHER']
export const deathSpecialInformants = ['SPOUSE']
