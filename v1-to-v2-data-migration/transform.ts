import { v4 as uuidv4 } from 'npm:uuid'

function legacyHistoryItemToV2ActionType(record, declaration, historyItem) {
  if (!historyItem.action) {
    if (historyItem.regStatus === 'DECLARED') {
      return {
        type: 'DECLARE',
        declaration: declaration,
        annotation: {
          'review.signature': record.registration.informantsSignature,
          'review.comment': historyItem.comments
            ?.map(({ comment }) => comment)
            .join('\n'),
        },
      }
    }
    if (historyItem.regStatus === 'REGISTERED') {
      return {
        type: 'REGISTER',
        declaration: {},
        registrationNumber: record.registration.registrationNumber,
      }
    }
    if (historyItem.regStatus === 'WAITING_VALIDATION') {
      return {
        type: 'REGISTER',
        declaration: {},
        status: 'Requested',
      }
    }
    if (historyItem.regStatus === 'VALIDATED') {
      return {
        type: 'VALIDATE',
        declaration: {},
      }
    }
  }

  const type = {
    FLAGGED_AS_POTENTIAL_DUPLICATE: 'DETECT_DUPLICATE',
    MARKED_AS_DUPLICATE: 'MARKED_AS_DUPLICATE',
    DOWNLOADED: 'READ',
    REQUESTED_CORRECTION: 'REQUEST_CORRECTION',
    APPROVED_CORRECTION: 'APPROVE_CORRECTION',
    REJECTED_CORRECTION: 'REJECT_CORRECTION',
  }[historyItem.action]
  if (!type) {
    console.log('Invalid action', historyItem)
  }

  return { type, declaration: {} }
}

export function transform(eventRegistration, resolver: Object) {
  const result = Object.entries(resolver).map(([fieldId, r]) => {
    return [fieldId, r(eventRegistration)]
  })
  const withOutNulls = result.filter(
    ([_, value]) => value !== null && value !== undefined
  )
  const declaration = Object.fromEntries(withOutNulls)

  const historyAsc = eventRegistration.history
    .sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
    .filter(
      (history) =>
        history.action !== 'ASSIGNED' && history.action !== 'UNASSIGNED'
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
        .filter((history) => history.action !== 'VIEWED')
        .map((history) => {
          return {
            id: uuidv4(), // history.id /* @todo add to graphql */,
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
              history
            ),
          }
        }),
    ],
  }

  return documents
}
