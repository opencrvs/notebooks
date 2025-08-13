import { expect } from 'jsr:@std/expect'
import { generateBirthRegistration } from './data-generators.ts'
import { authenticate } from '../v1-to-v2-data-migration/authentication.ts'
import { GATEWAY } from '../v1-to-v2-data-migration/helpers/routes.ts'
import { createDeclaration, getEvent, runMigration } from './utils.ts'

Deno.test('Create some data to test with', async (t) => {
  const token = await authenticate(GATEWAY, 'k.mweene', 'test')

  const birthDeclaration = await generateBirthRegistration()

  await t.step('Post declaration', async () => {})

  console.log(birthDeclaration)
  const result = await createDeclaration(token.toString(), birthDeclaration)
  console.log(result)

  const { compositionId } = result.data.createBirthRegistration
  console.log('CompositionId:', compositionId)

  await runMigration()

  const data = await getEvent(compositionId, token)
  console.log(data)

  expect(data).toBeDefined()
  expect(birthDeclaration).toBe(data[0].declaration)
})
