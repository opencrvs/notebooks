import { Locator, Page, expect } from '@playwright/test'
import {
  AUTH_URL,
  CLIENT_URL,
  CLIENT_V2_URL,
  CREDENTIALS,
  GATEWAY_HOST,
  SAFE_INPUT_CHANGE_TIMEOUT_MS,
  SAFE_OUTBOX_TIMEOUT_MS
} from './constants'
import { isArray } from 'lodash'
import fetch from 'node-fetch'

export async function login(page: Page, username: string, password: string) {
  const token = await getToken(username, password)
  await page.goto(`${CLIENT_URL}?token=${token}`)

  await expect(
    page.locator('#appSpinner').or(page.locator('#pin-input'))
  ).toBeVisible()
  return token
}

export async function createPIN(page: Page) {
  await page.click('#pin-input')
  for (let i = 1; i <= 8; i++) {
    await page.type('#pin-input', `${i % 2}`)
  }
}

export async function logout(page: Page) {
  await page.locator('#ProfileMenu-dropdownMenu').click()
  await page
    .locator('#ProfileMenu-dropdownMenu')
    .getByRole('listitem')
    .filter({
      hasText: new RegExp('Logout')
    })
    .click()
  await page.context().clearCookies()
}

export async function loginToV2(
  page: Page,
  credentials = CREDENTIALS.LOCAL_REGISTRAR,
  skipPin?: boolean
) {
  const token = await login(page, credentials.USERNAME, credentials.PASSWORD)

  if (!skipPin) {
    await createPIN(page)
  }

  // Navigate to the v2 client
  await page.goto(CLIENT_V2_URL)

  return token
}

export async function getToken(username: string, password: string) {
  const authUrl = `${AUTH_URL}/authenticate`
  const verifyUrl = `${AUTH_URL}/verifyCode`

  const authResponse = await fetch(authUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })

  const authBody = await authResponse.json()
  const verifyResponse = await fetch(verifyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nonce: authBody.nonce,
      code: '000000'
    })
  })

  const verifyBody = await verifyResponse.json()

  return verifyBody.token
}

export async function getClientToken(client_id: string, client_secret: string) {
  const authUrl = `${AUTH_URL}/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`

  const authResponse = await fetch(authUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const authBody = await authResponse.json()

  return authBody.access_token
}

type DeclarationSection =
  | 'child'
  | 'informant'
  | 'father'
  | 'mother'
  | 'documents'
  | 'preview'
  | 'groom'
  | 'bride'
  | 'marriageEvent'
  | 'witnessOne'
  | 'witnessTwo'
type CorrectionSection = 'summary'
type V2ReviewSection = 'review'

export const goToSection = async (
  page: Page,
  section: DeclarationSection | CorrectionSection | V2ReviewSection
) => {
  while (!page.url().includes(`/${section}`)) {
    await page.getByRole('button', { name: 'Continue' }).click()
  }
}

/*
  Generates a random past date
  at least 'minAge' years + 'offset' days ago
  and up to an additional 'range' days earlier
*/
export const getRandomDate = (
  minAge: number,
  range: number,
  offset: number = 0
) => {
  const randomDate = new Date()
  randomDate.setDate(
    new Date().getDate() -
      Math.random() * range -
      minAge * 365 -
      (minAge + 3) / 4 -
      offset
  )
  const [yyyy, mm, dd] = randomDate.toISOString().split('T')[0].split('-')
  return { dd, mm, yyyy }
}

export async function ensureLoginPageReady(page: Page) {
  /*
   * Wait until config for loading page has been loaded
   */
  await page.waitForSelector('#Box img', { state: 'attached' })
  await page.waitForFunction(() => {
    const img = document.querySelector<HTMLImageElement>('#Box img')!
    return img && img.src && img.src.trim() !== ''
  })
}

export async function validateSectionButtons(page: Page) {
  await expect(page.getByText('Continue', { exact: true })).toBeVisible()
  await expect(page.getByText('Exit', { exact: true })).toBeVisible()
  await expect(page.getByText('Save & Exit', { exact: true })).toBeVisible()
  await expect(page.locator('#eventToggleMenu-dropdownMenu')).toBeVisible()
}

export const uploadImage = async (
  page: Page,
  locator: Locator,
  image = './e2e/assets/528KB-random.png'
) => {
  const fileChooserPromise = page.waitForEvent('filechooser')
  await locator.click()
  const fileChooser = await fileChooserPromise
  await fileChooser.setFiles(image)
  return fileChooser
}

/**
 * @page - page object
 * @sectionLocator - locator for the section e.g. mother / father
 * @sectionTitle - title of the section to  e.g. National ID / Passport
 * @buttonLocator - locator for the button to upload the image
 */
export const uploadImageToSection = async ({
  page,
  sectionLocator,
  sectionTitle,
  buttonLocator
}: {
  page: Page
  sectionLocator: Locator
  buttonLocator: Locator
  sectionTitle: string
}) => {
  await sectionLocator.getByText('Select...').click()
  await sectionLocator.getByText(sectionTitle, { exact: true }).click()

  await uploadImage(page, buttonLocator)
}

export const expectAddress = async (
  locator: Locator,
  address: { [key: string]: any },
  isDeletion?: boolean
) => {
  const addressKeys = [
    'country',

    'state',
    'province',

    'district',

    'village',
    'town',
    'city',

    'residentialArea',
    'addressLine1',

    'street',
    'addressLine2',

    'number',
    'addressLine3',

    'postcodeOrZip',
    'postalCode',
    'zipCode'
  ]

  if (isArray(address.line)) {
    address.addressLine1 = address.line[2]
    address.addressLine2 = address.line[1]
    address.addressLine3 = address.line[0]
  }

  const texts = addressKeys
    .map((key) => address[key])
    .filter((value) => Boolean(value))

  if (isDeletion) {
    const deletionLocators = await locator.getByRole('deletion').all()
    for (let i = 0; i < texts.length; i++) {
      await expect(deletionLocators[getDeletionPosition(i)]).toContainText(
        texts[i]
      )
    }
  } else await expectTexts(locator, texts)
}

/*
  The deletion section is formatted like bellow:
  	'-'
    'Farajaland'
    'Central'
    'Ibombo'
    'Example Town' / 'Example village'
    'Mitali Residential Area'
    '4/A'
    '1324'

*/
const getDeletionPosition = (i: number) => i + 1 // for the extra '-' at the beginning

export const expectTexts = async (locator: Locator, texts: string[]) => {
  for (const text of texts) {
    await expect(locator).toContainText(text)
  }
}

export const joinValuesWith = (
  values: (string | number | null | undefined)[],
  separator = ' '
) => {
  return values.filter(Boolean).join(separator)
}

type PersonOrName = {
  firstNames?: string
  familyName?: string
  [key: string]: any
}
export const formatName = (name: PersonOrName) => {
  const nameArray = [] as any[]
  if (name.firstNames) nameArray.push(name.firstNames)
  if (name.familyName) nameArray.push(name.familyName)
  return joinValuesWith(nameArray)
}

export async function selectAction(
  page: Page,
  action:
    | 'Print certificate'
    | 'Declare'
    | 'Validate'
    | 'Register'
    | 'Assign'
    | 'Unassign'
    | 'Delete'
) {
  if ((await page.getByTestId('status-value').innerText()) !== 'Draft') {
    await ensureAssigned(page)
  }

  // Keep retrying the click until the dropdown is visible
  let isVisible = false
  let attempts = 0
  const maxAttempts = 10

  while (!isVisible && attempts < maxAttempts) {
    await page.getByRole('button', { name: 'Action', exact: true }).click()
    isVisible = await page
      .locator('#action-Dropdown-Content')
      .getByText(action, { exact: true })
      .isVisible()

    if (!isVisible) {
      // Small wait before retrying
      await page.waitForTimeout(500)
      attempts++
    }
  }

  await page
    .locator('#action-Dropdown-Content')
    .getByText(action, { exact: true })
    .click()
}

export async function ensureAssigned(page: Page) {
  await page.waitForTimeout(SAFE_INPUT_CHANGE_TIMEOUT_MS)

  await page.getByRole('button', { name: 'Action' }).click()

  const unAssignAction = page
    .locator('#action-Dropdown-Content li')
    .filter({ hasText: new RegExp(`^Unassign$`, 'i') })
    .first()

  let assignAction = page
    .locator('#action-Dropdown-Content li')
    .filter({ hasText: new RegExp(`^Assign$`, 'i') })
    .first()

  // Wait until either "Unassign" or "Assign" is visible
  await Promise.race([
    unAssignAction.waitFor({ state: 'visible' }),
    assignAction.waitFor({ state: 'visible' })
  ])

  if (await unAssignAction.isVisible()) {
    await unAssignAction.click()
    await ensureOutboxIsEmpty(page)
    await expect(page.getByTestId('assignedTo-value')).toHaveText(
      'Not assigned'
    )
    await page.getByRole('button', { name: 'Action' }).click()

    assignAction = page
      .locator('#action-Dropdown-Content li')
      .filter({ hasText: new RegExp(`^Assign$`, 'i') })
      .first()
  }

  if (await assignAction.isVisible()) {
    await assignAction.click()
    /**
     * We need to wait a while before assign mutation goes to outbox.
     * Reason: We have `await refetchEvent()` before assign mutation is fired
     */

    await expect(page.locator('#navigation_workqueue_outbox')).toContainText(
      '1',
      {
        timeout: SAFE_OUTBOX_TIMEOUT_MS
      }
    )
    await ensureOutboxIsEmpty(page)
  }

  await expect(page.getByTestId('assignedTo-value')).not.toHaveText(
    'Not assigned'
  )
}

export async function expectInUrl(page: Page, assertionString: string) {
  await expect(page.url().includes(assertionString)).toBeTruthy()
}

export async function ensureOutboxIsEmpty(page: Page) {
  await page.waitForTimeout(SAFE_INPUT_CHANGE_TIMEOUT_MS)

  await expect(page.locator('#navigation_workqueue_outbox')).not.toContainText(
    '1',
    {
      timeout: SAFE_OUTBOX_TIMEOUT_MS
    }
  )
}