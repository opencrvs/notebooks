import { getCustomField } from "../helpers/resolverUtils.ts"

export const V1_TO_V2_VERIFICATION_STATUS: Record<string, string> = {
  "authenticated": "authenticated",
  "verified": "verified",
  "failed": "failed",
  "pending": "pending",
  // V1 could have a state where the E-Signet call failed in client. Now we show a generic failed state until the flow is improved further.
  "failedFetchIdDetails": "failed"
}

export const getCustomFieldVerificationStatus = (data: any, id: string) => {
  const fieldValue = getCustomField(data, id) as string | undefined

  if (!fieldValue) {
    return undefined
  }

  const status = V1_TO_V2_VERIFICATION_STATUS[fieldValue]

  if (!status) {
    throw new Error(`Ran into a MOSIP verification status "${fieldValue}" state that couldn't be mapped.`)
  }

  return status
}