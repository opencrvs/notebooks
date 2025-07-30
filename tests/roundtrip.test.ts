import { expect } from 'jsr:@std/expect'
import { generateBirthRegistration } from './data-generators.ts'
import { authenticate } from '../v1-to-v2-data-migration/authentication.ts'
import { GATEWAY } from '../v1-to-v2-data-migration/helpers/routes.ts'
import { CREATE_BIRTH_REGISTRATION } from './queries.ts'
import type * as fhir from 'npm:@types/fhir'

export function convertGeneratedDataToBirthDetails(
  generatedData: ReturnType<typeof generateBirthRegistration>
): any {
  return {
    informant: {
      type: generatedData.registration.informantType,
    },
    child: {
      firstNames: generatedData.child.name[0].firstNames,
      familyName: generatedData.child.name[0].familyName,
      birthDate: generatedData.child.birthDate,
      gender: generatedData.child.gender,
      birthType: generatedData.mother.multipleBirth > 1 ? 'MULTIPLE' : 'SINGLE',
      weightAtBirth: generatedData.weightAtBirth,
      placeOfBirth: generatedData.eventLocation.type,
      birthFacility:
        generatedData.eventLocation.type === 'HEALTH_FACILITY'
          ? 'Ibombo Rural Health Centre'
          : undefined,
      birthLocation: {
        state: 'Central',
        district: 'Ibombo',
      },
    },
    mother: {
      firstNames: generatedData.mother.name[0].firstNames,
      familyName: generatedData.mother.name[0].familyName,
      age: generatedData.mother.ageOfIndividualInYears,
      maritalStatus: generatedData.mother.maritalStatus as
        | 'SINGLE'
        | 'MARRIED'
        | 'DIVORCED'
        | 'WIDOWED',
    },
    father: {
      firstNames: generatedData.father.name[0].firstNames,
      familyName: generatedData.father.name[0].familyName,
      birthDate: generatedData.father.birthDate,
    },
    attendant: {
      type: generatedData.attendantAtBirth as
        | 'PHYSICIAN'
        | 'NURSE'
        | 'MIDWIFE'
        | 'OTHER',
    },
  }
}

export async function getAllLocations(
  type: 'ADMIN_STRUCTURE' | 'HEALTH_FACILITY' | 'CRVS_OFFICE'
) {
  const locations = (await fetch(
    `${GATEWAY}/location?type=${type}&_count=0`
  ).then((res) => res.json())) as fhir.Bundle

  return locations.entry!.map((entry: { resource: any }) => entry.resource)
}

export async function createDeclaration(token: string, details: any) {
  const res = await fetch(`${GATEWAY}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: CREATE_BIRTH_REGISTRATION,
      variables: { details },
    }),
  })
  return res.json()
}

Deno.test('Create some data to test with', async (t) => {
  const token = await authenticate(GATEWAY, 'k.mweene', 'test')
  const locations = await getAllLocations('ADMIN_STRUCTURE')

  const birthDeclaration = generateBirthRegistration(locations)
  await t.step('Post declaration', async () => {})

  console.log(birthDeclaration)
  const result = await createDeclaration(token.toString(), birthDeclaration)

  expect(result).toBe(false)
})
