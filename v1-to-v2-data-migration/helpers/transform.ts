import { v4 as uuidv4 } from 'npm:uuid'
import {
  DEFAULT_FIELD_MAPPINGS,
  MAPPING_FOR_CUSTOM_FIELDS,
} from './defaultMappings.ts'
import { COUNTRY_FIELD_MAPPINGS } from './countryMappings.ts'
import { COLLECTOR_RESOLVER } from './collectorResolver.ts'
import { NAME_CONFIG } from './nameConfig.ts'
import { ADDRESS_CONFIG } from './addressConfig.ts'
import {
  EventRegistration,
  HistoryItem,
  ResolverMap,
  TransformedDocument,
  Action,
  ActionType,
} from './types.ts'

const mappings = { ...DEFAULT_FIELD_MAPPINGS, ...COUNTRY_FIELD_MAPPINGS }

function patternMatch(
  correction: Record<string, any>,
  declaration: Record<string, any>
) {
  const transformedData: Record<string, any> = {}

  for (const [key, value] of Object.entries(correction)) {
    const valueKey = mappings[key as keyof typeof mappings]
    if (valueKey) {
      transformedData[valueKey] = value
    } else if (NAME_CONFIG[key]) {
      const nameMapping = NAME_CONFIG[key](value as string)
      const nameKey = Object.keys(nameMapping)[0]
      const existing = transformedData[nameKey] || {}
      transformedData[nameKey] = { ...existing, ...nameMapping[nameKey] }
    } else if (ADDRESS_CONFIG[key]) {
      const addressMapping = ADDRESS_CONFIG[key](value as string)
      let addressKey = Object.keys(addressMapping)[0]
      let addressData = null

      if (addressKey === 'child.address.privateHome') {
        addressKey = declaration[addressKey]
          ? addressKey
          : 'child.address.other'
      }

      const transformedWithSameKey = transformedData[addressKey] || {}

      addressData = addressMapping[addressKey]
      const currentAddress = declaration[addressKey] || {}
      transformedData[addressKey] = {
        ...currentAddress,
        ...transformedWithSameKey,
        ...addressData,
        streetLevelDetails: {
          ...(currentAddress.streetLevelDetails || {}),
          ...(transformedWithSameKey.streetLevelDetails || {}),
          ...addressData.streetLevelDetails,
        },
      }
    } else {
      const parts = key.split('.')
      const prefix = parts.slice(0, 2).join('.')
      const suffix = parts.slice(2).join('.')
      const mapKey = Object.keys(MAPPING_FOR_CUSTOM_FIELDS).find(
        (m) => m.startsWith(prefix) && m.endsWith(suffix)
      )
      if (mapKey) {
        const valueKey =
          MAPPING_FOR_CUSTOM_FIELDS[
            mapKey as keyof typeof MAPPING_FOR_CUSTOM_FIELDS
          ]
        transformedData[valueKey] = value
      }
    }
  }

  return transformedData
}

export function transformCorrection(
  historyItem: HistoryItem,
  event: 'birth' | 'death',
  declaration: Record<string, any>
): Record<string, any> {
  const v1Declaration =
    historyItem.output?.reduce((acc: Record<string, any>, curr: any) => {
      acc[`${event}.${curr.valueCode}.${curr.valueId}`] = curr.value
      return acc
    }, {}) || {}

  return patternMatch(v1Declaration, declaration)
}

function legacyHistoryItemToV2ActionType(
  record: EventRegistration,
  declaration: Record<string, any>,
  historyItem: HistoryItem
): Partial<Action> {
  if (!historyItem.action) {
    switch (historyItem.regStatus) {
      case 'DECLARED':
        const signed = record.registration.informantsSignature
        const uri = signed && new URL(signed)
        return {
          type: 'DECLARE' as ActionType,
          declaration: declaration,
          annotation: {
            'review.signature': signed &&
              uri &&
              typeof uri !== 'string' && {
                path: uri.pathname,
                originalFilename: uri.pathname.replace('/ocrvs/', ''),
                type: 'image/png',
              },
            'review.comment': historyItem.comments
              ?.map(({ comment }: any) => comment)
              .join('\n'),
          },
        }
      case 'REGISTERED':
        return {
          type: 'REGISTER' as ActionType,
          declaration: {},
          registrationNumber: record.registration.registrationNumber,
        }
      case 'WAITING_VALIDATION':
        return {
          type: 'REGISTER' as ActionType,
          declaration: {},
          status: 'Requested',
        }
      case 'VALIDATED':
        return {
          type: 'VALIDATE' as ActionType,
          declaration: {},
        }
      case 'ISSUED':
        const annotation = {}
        Object.keys(COLLECTOR_RESOLVER).forEach((key) => {
          const resolver =
            COLLECTOR_RESOLVER[key as keyof typeof COLLECTOR_RESOLVER]
          const value =
            historyItem.certificates && resolver(historyItem.certificates[0])
          if (value) {
            ;(annotation as any)[key] = value
          }
        })

        return {
          type: 'PRINT_CERTIFICATE' as ActionType,
          content: {
            templateId: historyItem.certificateTemplateId,
          },
          declaration: {},
          annotation: annotation,
        }
      case 'REJECTED':
        return {
          status: 'Rejected',
          type: 'REJECT' as ActionType,
          declaration: {},
          content: {
            reason: historyItem.statusReason?.text,
          },
        }
      case 'ARCHIVED':
        return {
          type: 'ARCHIVE' as ActionType,
          declaration: {},
          content: {
            reason: historyItem.statusReason?.text || 'None',
          },
        }
      default:
        break
    }
  }

  switch (historyItem.action) {
    case 'REQUESTED_CORRECTION':
      return {
        status: 'Requested',
        type: 'REQUEST_CORRECTION' as ActionType,
        declaration: transformCorrection(
          historyItem,
          record.child ? 'birth' : 'death',
          declaration
        ),
        annotation: {
          'fees.amount': historyItem.payment?.amount,
          'reason.option': historyItem.reason,
          'reason.other': historyItem.otherReason,
          'requester.identity.verify': historyItem.hasShowedVerifiedDocument,
          'requester.type':
            historyItem.requester === 'REGISTRAR'
              ? 'ME'
              : historyItem.requester,
          'requester.other': historyItem.requesterOther,
        },
      }
    case 'APPROVED_CORRECTION':
      return {
        type: 'APPROVE_CORRECTION' as ActionType,
        requestId: historyItem.requestId,
        declaration: {},
        annotation: historyItem.annotation,
      }
    case 'ASSIGNED':
      return {
        type: 'ASSIGN' as ActionType,
        assignedTo: historyItem.user?.id,
        declaration: {},
      }
    case 'REJECTED_CORRECTION':
      return {
        status: 'Rejected',
        type: 'REJECT_CORRECTION' as ActionType,
        requestId: historyItem.requestId,
        declaration: {},
        content: {
          reason: historyItem.reason,
        },
      }
    case 'FLAGGED_AS_POTENTIAL_DUPLICATE':
      return {
        type: 'DUPLICATE_DETECTED' as ActionType,
        declaration: {},
        content: {
          duplicates:
            record.registration.duplicates?.map((x: any) => x.compositionId) ||
            [],
        },
      }

    default:
      break
  }

  const actionMap: Record<string, ActionType> = {
    MARKED_AS_DUPLICATE: 'MARK_AS_DUPLICATE',
    MARKED_AS_NOT_DUPLICATE: 'MARK_NOT_DUPLICATE',
    DOWNLOADED: 'READ',
    UNASSIGNED: 'UNASSIGN',
    VIEWED: 'READ',
  }

  const type = historyItem.action ? actionMap[historyItem.action] : undefined
  if (!type) {
    console.log('Invalid action', historyItem)
  }

  return { type, declaration: {} }
}

function nonNullObjectKeys(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== null && value !== undefined
    )
  )
}

export function transform(
  eventRegistration: EventRegistration,
  resolver: ResolverMap
): TransformedDocument {
  const result = Object.entries(resolver).map(([fieldId, r]) => {
    return [fieldId, r(eventRegistration)]
  })

  const withOutNulls = result.filter(
    ([_, value]) => value !== null && value !== undefined
  )
  const declaration = Object.fromEntries(withOutNulls)

  // Handle CORRECTED items by duplicating them
  const processedHistory: any[] = []
  const issued: any[] = []
  const rejected: any[] = []
  let issuances = 0
  for (const historyItem of eventRegistration.history) {
    if (historyItem.action === 'CORRECTED') {
      const requestCorrectionId = uuidv4()

      // First item: REQUEST_CORRECTION
      processedHistory.push({
        ...historyItem,
        action: 'REQUESTED_CORRECTION',
        id: requestCorrectionId,
      })

      // Second item: APPROVE_CORRECTION
      processedHistory.push({
        ...historyItem,
        action: 'APPROVED_CORRECTION',
        requestId: requestCorrectionId,
        annotation: {
          isImmediateCorrection: true,
        },
      })
    } else if (historyItem.action === 'REJECTED_CORRECTION') {
      rejected.push(historyItem)
    } else if (historyItem.action === 'REQUESTED_CORRECTION') {
      historyItem.id = uuidv4()
      const rej = rejected.pop()
      rej.requestId = historyItem?.id
    } else if (!historyItem.action && historyItem.regStatus === 'CERTIFIED') {
      const matchingIssue = issued.pop()

      const issuedNotNull: any = matchingIssue
        ? nonNullObjectKeys(matchingIssue)
        : { certificates: [{}] }

      const cert = historyItem.certificates?.reverse()?.[issuances]

      processedHistory.push({
        ...historyItem,
        ...issuedNotNull,
        certificates: [
          { ...cert, ...nonNullObjectKeys(issuedNotNull.certificates[0]) },
        ],
      })
      issuances++
    } else if (!historyItem.action && historyItem.regStatus === 'ISSUED') {
      issued.push({
        ...historyItem,
        certificates: [historyItem.certificates?.reverse()?.[issuances]],
      })
      issuances++
    } else {
      processedHistory.push(historyItem)
    }
  }

  const historyAsc = processedHistory
    .sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
    .filter((x) => x.system?.type !== 'IMPORT_EXPORT') // Remove migration system actions
    .filter((x) => x.action || x.regStatus !== 'CERTIFIED') // We're dropping certified in favour of issued

  const newest = historyAsc[historyAsc.length - 1]

  const documents: TransformedDocument = {
    id: eventRegistration.id,
    type: eventRegistration.child ? 'birth' : 'death',
    createdAt: new Date(historyAsc[0].date).toISOString(),
    updatedAt: new Date(newest.date).toISOString(),
    updatedAtLocation: newest.office?.id || '',
    trackingId: eventRegistration.registration.trackingId,
    actions: [
      {
        type: 'CREATE' as ActionType,
        createdAt: new Date(historyAsc[0].date).toISOString(),
        createdBy: historyAsc[0].user?.id || '',
        createdByUserType: 'user' as const,
        createdByRole: historyAsc[0].user?.role?.id || '',
        createdAtLocation: historyAsc[0].office?.id,
        updatedAtLocation: historyAsc[0].office?.id,
        status: 'Accepted',
        declaration: {},
        id: uuidv4(),
        transactionId: uuidv4(),
      },
      ...historyAsc.map((history) => {
        return {
          id: history?.id || uuidv4(), // TODO for some reason the backend can send items with the same id, breaking Pkey
          transactionId: uuidv4(),
          createdAt: new Date(history.date).toISOString(),
          createdBy: history.user?.id || history.system?.type || '',
          createdByUserType: history.user
            ? ('user' as const)
            : ('system' as const),
          createdByRole: history.user?.role?.id || history.system?.type || '',
          createdAtLocation: history.office?.id,
          updatedAtLocation: history.office?.id,
          status: 'Accepted',
          ...legacyHistoryItemToV2ActionType(
            eventRegistration,
            declaration,
            history
          ),
        } as Action
      }),
    ],
  }

  return documents
}
