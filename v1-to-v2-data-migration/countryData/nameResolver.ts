import { EventRegistration, Name } from '../helpers/types.ts'

export const resolveName = (
  data: EventRegistration,
  name: Name | undefined
): Name | null =>
  name
    ? {
        firstname: name?.firstNames,
        middleName: name?.middleName,
        surname: name?.familyName,
        /* For potential custom field
        grandfatherName: getCustomField(data, 'birth.child.grandfatherName'),
         */
      }
    : null
