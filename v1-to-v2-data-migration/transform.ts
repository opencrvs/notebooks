import { v4 as uuidv4 } from "npm:uuid";


function convertAddress(address) {
  const international = address.country !== "FAR";
  if (international) {
    return {
      addressType: "INTERNATIONAL",
      country: address.country,
      state: address.state,
      district2: address.district,
      cityOrTown: address.city,
      addressLine1: address.line.filter(Boolean)[0],
      addressLine2: address.line.filter(Boolean)[1],
      addressLine3: address.line.filter(Boolean).slice(2).join(", "),
      postcodeOrZip: address.postalCode,
    };
  }

  const rural = address.line.some((line) => line === "RURAL");

  if (rural) {
    return {
      addressType: "DOMESTIC",
      urbanOrRural: "RURAL",
      country: address.country,
      province: address.state,
      district: address.district,
      village: address.line.find((line) => line.trim() !== ""),
    };
  }

  return {
    addressType: "DOMESTIC",
    urbanOrRural: "URBAN",
    country: address.country,
    province: address.state,
    district: address.district,
    town: address.city,
    zipCode: address.postalCode,
  };
}

export const resolver = {
  "child.firstname": (data) => data.child.name[0].firstNames,

  /*
   * OPTIONAL FOR COUNTRIES
   */
  "child.middleName": (data) => data.child.name[0].middleName,

  "child.surname": (data) => data.child.name[0].familyName,
  "child.gender": (data) => data.child.gender,
  "child.dob": (data) => data.child.birthDate,
  /*
   * Address fields in different situations
   * @todo Addresses need to be properly handled
   */
  "child.placeOfBirth": (data) => data.eventLocation.type,
  "child.birthLocation": (data) =>
    data.eventLocation.type === "HEALTH_FACILITY"
      ? data.eventLocation.id
      : null,
  "child.address.privateHome": (data) =>
    data.eventLocation.type === "PRIVATE_HOME"
      ? convertAddress(data.eventLocation.address)
      : null,
  "child.address.other": (data) =>
    data.eventLocation.type === "OTHER"
      ? convertAddress(data.eventLocation.address)
      : null,
  /*
   * MISSING FIELDS that are in GraphQL but not in the form
   * In GraphQL there's a field "otherAttendantAtBirth". I wonder what that is
   */
  "child.attendantAtBirth": (data) => data.attendantAtBirth, // FieldType.SELECT,
  "child.birthType": (data) => data.birthType, // FieldType.SELECT,
  "child.weightAtBirth": (data) => data.weightAtBirth, // FieldType.NUMBER,
  /*
   * MISSING FIELDS that are in GraphQL but not in the form
   * childrenBornAliveToMother
   * foetalDeathsToMother
   * lastPreviousLiveBirth
   */
  "informant.dob": (data) => data.informant.birthDate, // type: 'DATE',
  /* @todo Addresses need to be properly handled */
  "informant.address": (data) => convertAddress(data.informant.address[0]), // type: FieldType.ADDRESS,
  // @question, is informant.telecom correct or this?
  "informant.phoneNo": (data) =>
    data.registration.contactPhoneNumber?.replace("+26", ""), // @todo https://github.com/opencrvs/opencrvs-core/issues/9601
  "informant.email": (data) => data.registration.contactEmail, // type: FieldType.EMAIL,
  "informant.relation": (data) => data.informant.relationship, // FieldType.SELECT
  "informant.other.relation": (data) => data.informant.otherRelationship, // FieldType.TEXT
  "informant.firstname": (data) => data.informant.name[0].firstNames, // FieldType.TEXT
  "informant.middleName": (data) => data.informant.name[0].middleName, // FieldType.TEXT
  "informant.surname": (data) => data.informant.name[0].familyName, // FieldType.TEXT
  "informant.dobUnknown": (data) => data.informant.exactDateOfBirthUnknown, // FieldType.CHECKBOX
  // @question, is this informant.age or informant.ageOfIndividualInYears?
  "informant.age": (data) =>
    data.informant.ageOfIndividualInYears?.toString() /* @todo not a fan of this */,
  "informant.nationality": (data) => data.informant.nationality?.[0], // FieldType.COUNTRY
  "mother.detailsNotAvailable": (data) => !data.mother.detailsExist,
  "mother.reason": (data) => data.mother.reasonNotApplying,
  "mother.firstname": (data) => data.mother.name?.[0].firstNames,
  "mother.surname": (data) => data.mother.name?.[0].familyName,
  "mother.dob": (data) => data.mother.birthDate,
  "mother.dobUnknown": (data) => data.mother.exactDateOfBirthUnknown,
  "mother.age": (data) =>
    data.mother.ageOfIndividualInYears?.toString() /* @todo not a fan of this */,
  "mother.nationality": (data) => data.mother.nationality?.[0],
  "mother.maritalStatus": (data) => data.mother.maritalStatus,
  "mother.educationalAttainment": (data) => data.mother.educationalAttainment,
  "mother.occupation": (data) => data.mother.occupation,
  "mother.previousBirths": (data) => data.mother.multipleBirth,
  "mother.address": (data) => convertAddress(data.mother.address[0]),
  "father.detailsNotAvailable": (data) => !data.father.detailsExist,
  // @question, is this the right field?
  "father.reason": (data) => data.father.reasonNotApplying,
  "father.firstname": (data) => data.father.name?.[0].firstNames,
  "father.surname": (data) => data.father.name?.[0].familyName,
  "father.dob": (data) => data.father.birthDate,
  "father.dobUnknown": (data) => data.father.exactDateOfBirthUnknown,
  "father.age": (data) =>
    data.father.ageOfIndividualInYears?.toString() /* @todo not a fan of this */,
  "father.nationality": (data) => data.father.nationality?.[0],
  "father.maritalStatus": (data) => data.father.maritalStatus,
  "father.educationalAttainment": (data) => data.father.educationalAttainment,
  "father.occupation": (data) => data.father.occupation,
  "father.address": (data) => convertAddress(data.father.address[0]),
  // @todo this is a nasty one as it never was a field in the database
  // but instead a computed field that just copied mothers address data for father as
  "father.addressSameAs": (data) =>
    JSON.stringify(data.father.address[0]) ===
    JSON.stringify(data.mother.address[0])
      ? "YES"
      : "NO",

  // @todo
  // PARENT: 'PARENT',
  // INFORMANT_ID_PROOF: 'INFORMANT_ID_PROOF',
  // LEGAL_GUARDIAN_PROOF: 'LEGAL_GUARDIAN_PROOF'
  "documents.proofOfBirth": (data) => {
    const document = data.registration.attachments?.find(
      ({ subject }) => subject === "CHILD"
    );
    if (!document) {
      return null;
    }
    return {
      filename: document.uri.replace("/ocrvs/", ""),
      originalFilename: document.uri.replace("/ocrvs/", ""),
      type: document.contentType,
    };
  },
  "documents.proofOfMother": (data) => {
    const document = data.registration.attachments?.find(
      ({ subject }) => subject === "MOTHER"
    );
    if (!document) {
      return null;
    }
    return [
      {
        filename: document.uri.replace("/ocrvs/", ""),
        originalFilename: document.uri.replace("/ocrvs/", ""),
        type: document.contentType,
        option: document.type,
      },
    ];
  },
  "documents.proofOfFather": (data) => {
    const document = data.registration.attachments?.find(
      ({ subject }) => subject === "FATHER"
    );
    if (!document) {
      return null;
    }
    return [
      {
        filename: document.uri.replace("/ocrvs/", ""),
        originalFilename: document.uri.replace("/ocrvs/", ""),
        type: document.contentType,
        option: document.type,
      },
    ];
  },
  "documents.proofOfInformant": (data) => {
    const document = data.registration.attachments?.find(
      ({ subject }) => subject === "INFORMANT_ID_PROOF"
    );
    if (!document) {
      return null;
    }
    return [
      {
        filename: document.uri.replace("/ocrvs/", ""),
        originalFilename: document.uri.replace("/ocrvs/", ""),
        type: document.contentType,
        option: document.type,
      },
    ];
  },
  "documents.proofOther": (data) => {
    const document = data.registration.attachments?.find(
      ({ subject }) => subject === "OTHER"
    );
    if (!document) {
      return null;
    }
    return [
      {
        filename: document.uri.replace("/ocrvs/", ""),
        originalFilename: document.uri.replace("/ocrvs/", ""),
        type: document.contentType,
        option: document.type,
      },
    ];
  },
  "informant.brn": (data) =>
    data.informant.identifier.find(
      ({ type }) => type === "BIRTH_REGISTRATION_NUMBER"
    )?.id,
  "mother.brn": (data) =>
    data.mother.identifier?.find(
      ({ type }) => type === "BIRTH_REGISTRATION_NUMBER"
    )?.id,
  "father.brn": (data) =>
    data.father.identifier?.find(
      ({ type }) => type === "BIRTH_REGISTRATION_NUMBER"
    )?.id,

  "informant.nid": (data) =>
    data.informant.identifier.find(({ type }) => type === "NATIONAL_ID")?.id,
  "mother.nid": (data) =>
    data.mother.identifier?.find(({ type }) => type === "NATIONAL_ID")?.id,
  "father.nid": (data) =>
    data.father.identifier?.find(({ type }) => type === "NATIONAL_ID")?.id,

  "informant.passport": (data) =>
    data.informant.identifier.find(({ type }) => type === "PASSPORT")?.id,
  "mother.passport": (data) =>
    data.mother.identifier?.find(({ type }) => type === "PASSPORT")?.id,
  "father.passport": (data) =>
    data.father.identifier?.find(({ type }) => type === "PASSPORT")?.id,

  // Previously custom fields
  "child.reason": (data) =>
    getCustomField(data, "birth.child.child-view-group.reasonForLateRegistration"),

  "informant.idType": (data) =>
    getCustomField(data, "birth.informant.informant-view-group.informantIdType"),

  "mother.idType": (data) =>
    getCustomField(data, "birth.mother.mother-view-group.motherIdType"),

  "father.idType": (data) =>
    getCustomField(data, "birth.father.father-view-group.fatherIdType"),
};

export function generateFieldId() {}

function getCustomField(data, id) {
  return data.questionnaire.find(
      ({ fieldId }) => fieldId === id
    )?.value
}

function legacyHistoryItemToV2ActionType(record, declaration, historyItem) {
  if (!historyItem.action) {
    if (historyItem.regStatus === "DECLARED") {
      return {
        type: "DECLARE",
        declaration: declaration,
        annotation: {
          "review.signature": record.registration.informantsSignature,
          "review.comment": historyItem.comments
            ?.map(({ comment }) => comment)
            .join("\n"),
        },
      };
    }
    if (historyItem.regStatus === "REGISTERED") {
      return {
        type: "REGISTER",
        declaration: {},
        registrationNumber: record.registration.registrationNumber,
      };
    }
    if (historyItem.regStatus === "WAITING_VALIDATION") {
      return {
        type: "REGISTER",
        declaration: {},
        status: "Requested",
      };
    }
    if (historyItem.regStatus === "VALIDATED") {
      return {
        type: "VALIDATE",
        declaration: {},
      };
    }
  }

  const type = {
    FLAGGED_AS_POTENTIAL_DUPLICATE: "DETECT_DUPLICATE",
    MARKED_AS_DUPLICATE: "MARKED_AS_DUPLICATE",
    DOWNLOADED: "READ",
    REQUESTED_CORRECTION: "REQUEST_CORRECTION",
    APPROVED_CORRECTION: "APPROVE_CORRECTION",
    REJECTED_CORRECTION: "REJECT_CORRECTION",
  }[historyItem.action];
  if (!type) {
    console.log("Invalid action", historyItem);
  }

  return { type, declaration: {} };
}

export function transform(birthRegistration) {
  const result = Object.entries(resolver).map(([fieldId, resolver]) => {
    return [fieldId, resolver(birthRegistration)];
  });
  const withOutNulls = result.filter(
    ([_, value]) => value !== null && value !== undefined
  );
  const declaration = Object.fromEntries(withOutNulls);

  const historyAsc = birthRegistration.history
    .sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
    .filter(
      (history) =>
        history.action !== "ASSIGNED" && history.action !== "UNASSIGNED"
    );
  const newest = historyAsc[historyAsc.length - 1];

  const documents = {
    id: birthRegistration.id,
    type: "v2.birth",
    createdAt: new Date(historyAsc[0].date).toISOString(),
    updatedAt: new Date(newest.date).toISOString(),
    updatedAtLocation: newest.office.id,
    trackingId: birthRegistration.registration.trackingId,
    actions: [
      {
        type: "CREATE",
        createdAt: new Date(historyAsc[0].date).toISOString(),
        createdBy: historyAsc[0].user.id,
        createdByRole: historyAsc[0].user.role.id,
        createdAtLocation: historyAsc[0].office.id,
        updatedAtLocation: historyAsc[0].office.id,
        status: "Accepted",
        declaration: {},
        id: uuidv4(),
        transactionId: uuidv4(),
      },
      ...historyAsc
        .filter((history) => history.action !== "VIEWED")
        .map((history) => {
          return {
            id: uuidv4(), // history.id /* @todo add to graphql */,
            transactionId: uuidv4(),
            createdAt: new Date(history.date).toISOString(),
            createdBy: history.user.id,
            createdByRole: history.user.role.id,
            createdAtLocation: history.office.id,
            updatedAtLocation: history.office.id,
            status: "Accepted",
            ...legacyHistoryItemToV2ActionType(
              birthRegistration,
              declaration,
              history
            ),
          };
        }),
    ],
  };

  return documents;
}
