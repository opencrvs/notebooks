import { v4 as uuidv4 } from 'npm:uuid'
import { DEFAULT_FIELD_MAPPINGS } from './correctionMappings.ts'
import { COUNTRY_FIELD_MAPPINGS } from './countryMappings.ts'
import { COLLECTOR_RESOLVER } from './collectorResolver.ts'

const mappings = { ...DEFAULT_FIELD_MAPPINGS, ...COUNTRY_FIELD_MAPPINGS }

function patternMatch(correction) {
  const transformedData = {}

  for (const [key, value] of Object.entries(correction)) {
    const parts = key.split('.')
    const prefix = parts.slice(0, 2).join('.')
    const suffix = '.' + parts.slice(2).join('.') // don't think I need the join
    const mapKey = Object.keys(mappings).find(
      (m) => m.startsWith(prefix) && m.endsWith(suffix)
    )
    if (mapKey) {
      // TODO this ignores all names and addresses for now
      transformedData[mappings[mapKey]] = value
    }
  }
  return transformedData
}

function transformCorrection(historyItem, resolver, event: 'birth' | 'death') {
  const v1Declaration = historyItem.output.reduce((acc, curr) => {
    acc[`${event}.${curr.valueCode}.${curr.valueId}`] = curr.value
    return acc
  }, {})
  //console.log('Original v1Declaration:', v1Declaration)

  const transformedData = patternMatch(v1Declaration)
  //console.log('Transformed: ', transformedData)

  return transformedData
}

function legacyHistoryItemToV2ActionType(
  record,
  declaration,
  historyItem,
  resolver
) {
  if (!historyItem.action) {
    switch (historyItem.regStatus) {
      case 'DECLARED':
        const signed = record.registration.informantsSignature
        const uri = signed && new URL(signed)
        return {
          type: 'DECLARE',
          declaration: declaration,
          annotation: {
            'review.signature': signed && {
              path: uri.pathname,
              originalFilename: uri.pathname.replace('/ocrvs/', ''),
              type: 'image/png',
            },
            'review.comment': historyItem.comments
              ?.map(({ comment }) => comment)
              .join('\n'),
          },
        }
      case 'REGISTERED':
        return {
          type: 'REGISTER',
          declaration: {},
          registrationNumber: record.registration.registrationNumber,
        }
      case 'WAITING_VALIDATION':
        return {
          type: 'REGISTER',
          declaration: {},
          status: 'Requested',
        }
      case 'VALIDATED':
        return {
          type: 'VALIDATE',
          declaration: {},
        }
      case 'ISSUED':
        const annotation = {}
        Object.keys(COLLECTOR_RESOLVER).forEach((key) => {
          const resolver = COLLECTOR_RESOLVER[key]
          const value = resolver(historyItem.certificates[0])
          if (value) {
            annotation[key] = value
          }
        })

        return {
          type: 'PRINT_CERTIFICATE',
          content: {
            templateId: historyItem.certificateTemplateId,
          },
          declaration: {},
          annotation: annotation,
        }
      case 'REJECTED':
        return {
          status: 'Rejected',
          type: 'REJECT',
          declaration: {},
          content: {
            reason: historyItem.statusReason.text,
          },
        }
      case 'ARCHIVED':
        return {
          type: 'ARCHIVE',
          declaration: {},
          content: {
            reason: historyItem.statusReason.text || 'None',
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
        type: 'REQUEST_CORRECTION',
        declaration: transformCorrection(
          historyItem,
          resolver,
          record.child ? 'birth' : 'death'
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
        type: 'APPROVE_CORRECTION',
        requestId: historyItem.requestId,
        declaration: {},
        annotation: historyItem.annotation,
      }
    case 'ASSIGNED':
      return {
        type: 'ASSIGN',
        assignedTo: historyItem.user?.id,
        declaration: {},
      }
    case 'REJECTED_CORRECTION':
      return {
        status: 'Rejected',
        type: 'REJECT_CORRECTION',
        requestId: historyItem.requestId,
        declaration: {},
        content: {
          reason: historyItem.reason,
        },
      }
    case 'FLAGGED_AS_POTENTIAL_DUPLICATE':
      return {
        type: 'DUPLICATE_DETECTED',
        declaration: {},
        content: {
          duplicates: record.registration.duplicates.map(
            (x) => x.compositionId
          ),
        },
      }

    default:
      break
  }

  const type = {
    MARKED_AS_DUPLICATE: 'MARK_AS_DUPLICATE',
    MARKED_AS_NOT_DUPLICATE: 'MARK_NOT_DUPLICATE',
    DOWNLOADED: 'READ',
    UNASSIGNED: 'UNASSIGN',
    VIEWED: 'READ',
  }[historyItem.action]
  if (!type) {
    console.log('Invalid action', historyItem)
  }

  return { type, declaration: {} }
}

function nonNullObjectKeys(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== null && value !== undefined
    )
  )
}

export function transform(eventRegistration, resolver: Object) {
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
      rej.requestId = historyItem.id
    } else if (!historyItem.action && historyItem.regStatus === 'CERTIFIED') {
      const matchingIssue = issued.pop()

      const issuedNotNull: any = matchingIssue
        ? nonNullObjectKeys(matchingIssue)
        : { certificates: [{}] }

      const cert = historyItem.certificates.reverse()[issuances]

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
        certificates: [historyItem.certificates.reverse()[issuances]],
      })
      issuances++
    } else {
      processedHistory.push(historyItem)
    }
  }

  const historyAsc = processedHistory.sort(
    (a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf()
  )
  const newest = historyAsc[historyAsc.length - 1]

  const documents = {
    id: eventRegistration.id,
    type: eventRegistration.child ? 'v2.birth' : 'v2.death',
    createdAt: new Date(historyAsc[0].date).toISOString(),
    updatedAt: new Date(newest.date).toISOString(),
    updatedAtLocation: newest.office.id,
    trackingId: eventRegistration.registration.trackingId,
    actions: [
      {
        type: 'CREATE',
        createdAt: new Date(historyAsc[0].date).toISOString(),
        createdBy: historyAsc[0].user.id,
        createdByUserType: 'user',
        createdByRole: historyAsc[0].user.role.id,
        createdAtLocation: historyAsc[0].office.id,
        updatedAtLocation: historyAsc[0].office.id,
        status: 'Accepted',
        declaration: {},
        id: uuidv4(),
        transactionId: uuidv4(),
      },
      ...historyAsc
        .filter((x) => !(!x.action && x.regStatus === 'CERTIFIED')) // filter out items without action or regStatus
        .map((history) => {
          return {
            id: history.id || uuidv4(), // TODO for some reason the backend can send items with the same id, breaking Pkey
            transactionId: uuidv4(),
            createdAt: new Date(history.date).toISOString(),
            createdBy: history.user.id,
            createdByUserType: 'user',
            createdByRole: history.user.role.id,
            createdAtLocation: history.office.id,
            updatedAtLocation: history.office.id,
            status: 'Accepted',
            ...legacyHistoryItemToV2ActionType(
              eventRegistration,
              declaration,
              history,
              resolver
            ),
          }
        }),
    ],
  }

  return documents
}
