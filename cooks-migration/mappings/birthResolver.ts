import { BirthCsvRecord, CsvFields } from '../helpers/csvTypes.ts'
import {
  BirthResolver,
  BirthInformant,
  BirthMetaData,
  AttendantAtBirth
} from '../helpers/birthTypes.ts'
import { IdType, LocationMap, Name } from '../helpers/types.ts'
import { Country } from '../helpers/addressConfig.ts'
import { birthInformantMap } from '../lookupMappings/informantTypes.ts'
import { nationalityMap } from '../lookupMappings/nationalities.ts'
import { raceMap } from '../lookupMappings/races.ts'
import { twinsMap } from '../lookupMappings/twins.ts'
import {
  deriveName,
  getLocationCode,
  getLocationFromRegNum,
  resolveAddress,
  resolveFacility,
  toAge,
  toCrvsDate,
  toGender,
  toISODate,
  toLegacy,
  toName,
  toTitleCase
} from '../helpers/resolverHelpers.ts'

const lookUpNameChange = (CsvFields: CsvFields, birthRef: string) => {
  return CsvFields.deedpoll
    .filter((record) => record.BIRTH_REF === birthRef)
    .sort(
      (a, b) =>
        new Date(toISODate(a.DATE)).getTime() -
        new Date(toISODate(b.DATE)).getTime()
    )
    .map((record) => ({
      ...toName(record.NEW_FIRSTNAMES, record.NEW_SURNAME),
      DP_REF: record.DP_REF
    }))
}

const toNationality = (
  nationality: string,
  race: string
): Country | undefined => {
  if (
    nationality.toLowerCase().includes('brit') &&
    race.toLowerCase().includes('cook')
  )
    return 'COK'
  return nationalityMap[nationality] || raceMap[race] || undefined
}

const fatherDetailsUnavailable = (data: BirthCsvRecord) =>
  Boolean(
    !data.FATHERS_NAME &&
    !data.FATHERS_SURNAME &&
    !data.FATHERS_DOB &&
    !data.FATHERS_AGE &&
    !data.FATHERS_BIRTHPLACE &&
    !data.FATHERS_NATIONALITY &&
    !data.FATHERS_RACE
  )

const motherDetailsUnavailable = (data: BirthCsvRecord) =>
  Boolean(
    !data.MOTHERS_NAME &&
    !data.MOTHERS_SURNAME &&
    !data.MOTHERS_DOB &&
    !data.MOTHERS_AGE &&
    !data.MOTHERS_BIRTHPLACE &&
    !data.MOTHERS_NATIONALITY &&
    !data.MOTHERS_RACE
  )

/*
   Create regex to extract name and surname
   Can be in the form:
   CHRISTIAN NAME "Jim Bob" SURNAME "Smith" D.P NO 178/90 : { firstname: Jim Bob; surname: Smith }
   CHRISTINA NAME: "Steve" D.P. NO: 109/23 - 15.12.2023 : { firstname: Steve; surname: undefined }
   CH N: "SALLY JOE" 1098 : { firstname: SALLY JOE; surname: undefined }
   CHRISTIAN NAME " Jess Benson" D.P : { firstname: Jess Benson; surname: undefined }
   CHRISTIAN NAMES: "JOHNMARY TEOKOTAI"  D.P. : { firstname: JOHNMARY TEOKOTAI; surname: undefined }
   CN: "MAY MAUI"  S: "MANI"  D.P : { firstname: MAY MAUI; surname: MANI }
   SURNAME "HERIA HARETI "D.P : { firstname: undefined; surname: HERIA HARETI }
   SURNAME:  "LEVI" : { firstname: undefined; surname: LEVI }
   SURNAME: AUMATANGI D.P. 24/94 : { firstname: undefined; surname: AUMATANGI }
   SURNAME: HERMAN COURT ORDER DATED 28.4.2003 : { firstname: undefined; surname: HERMAN }
   SURNAME: RAMANIA D.P. : { firstname: undefined; surname: RAMANIA }
   SURNAME:"FOSTER-JONASSEN" D.P NO: 7/11   CHRISTIAN NAME:" ARTHUR DAMIEN EDWIN HEZEKIAH" : { firstname: ARTHUR DAMIEN EDWIN HEZEKIAH; surname: FOSTER-JONASSEN }
  
  */
const getNewName = (data: string): Name => {
  // ── Quoted value ──────────────────────────────────────────────────────────────
  // Three alternations — each is its own capture group:
  //   g1: "value"   closing may be " or '  (allows embedded apostrophes, e.g. "KA'QI")
  //   g2: ''value'' (Cook Islands double-apostrophe style)
  //       closing accepts ''  OR  ' OR  " — mismatched closings are common in the source
  //   g3: 'value'   closing may be ' or "
  const QUOTED =
    /(?:"([^"]+?)["']?(?!\w)|''([^'"]+?)(?:''|['"])|'([^'"]+?)['"])/i

  const pickQ = (m: RegExpMatchArray | null): string => {
    if (!m) return ''
    return (m[1] ?? m[2] ?? m[3] ?? '').trim()
  }

  // ── Firstname label ───────────────────────────────────────────────────────────
  // Covers:
  //   • All misspellings of CHRISTIAN/CRISTIAN + optional name-word (NAME, NAMES,
  //     NANE, NAEM, NAEME, AMEN, MA,E…) including NAMECHANGED (no space)
  //   • Optional verb phrase: CHANGED TO:?  |  ADDED  |  CHANGED:  (with any
  //     intermediate content up to the first quote — handled by fnQuotedSkip below)
  //   • CH N / CH NAME / CN
  //   • Separator: colon, semicolon, or absent
  const FN_LABEL =
    /(?:C(?:H[A-Z]*|R[A-Z]*)(?:\s+[A-Z]+)?|CH\s+N(?:AME)?|CN)\s*(?:CHANGED(?:\s+TO:?)?|ADDED)?\s*[;:]?\s*/i

  // ── Surname label ─────────────────────────────────────────────────────────────
  // SURNAME/SURNAMES + misspellings (SUNAME, SURANAME, SURANME, SURNMAE, SURNAM)
  // + optional CHANGED TO:?  |  NAME
  // SN — separator: colon, semicolon, or absent
  const SN_LABEL =
    /(?:SUR?[A-Z]*|SN)\s*(?:CHANGED(?:\s+TO:?)?|NAME)?\s*[;:]?\s*/i

  // ── Firstname extraction strategies (in priority order) ───────────────────────

  // 1. Inline paren: MATANGI(CHRISTIAN NAME) HENRY(SURNAME)
  const inlineParenFn = data.match(
    /^([A-Z][A-Z\s\-.]+?)\s*\(CHRISTIAN\s*NAME\)/i
  )
  const inlineParenSn = data.match(/\)\s*([A-Z][A-Z\s\-.]+?)\s*\(SURNAME\)/i)

  // 2. Paren + immediately following quote: (CHRISTIAN NAME ...) "VALUE"
  const parenQuotedFn = data.match(
    new RegExp(
      String.raw`\((?:CHRISTIAN\s+NAME[^)]*)\)\s*[;:]?\s*` + QUOTED.source,
      'i'
    )
  )

  // 3. Paren + unquoted: (CHRISTIAN NAME ...) UNQUOTED — stops before ( or D.P/end
  const parenUnquotedFn = data.match(
    /\((?:CHRISTIAN\s+NAME[^)]*)\)\s*[;:]?\s*([A-Z][A-Z0-9\s\-.]+?)(?=\s*(?:\(|D[./]P|$))/i
  )

  // 4. NAME precedes paren: VALUE (CHRISTIAN NAME ...)
  const beforeParenFn = data.match(
    /^([A-Z][A-Z0-9\s\-.]+?)\s*\(CHRISTIAN\s+NAME/i
  )

  // 5. Labelled + immediately adjacent quoted value
  const fnQuoted = data.match(new RegExp(FN_LABEL.source + QUOTED.source, 'i'))

  // 6. Labelled + quoted value with arbitrary content in between
  //    Handles: CHRISTIAN NAME CHANGED: D/P ref "VALUE"
  //             CHRISTIAN NAME CHANGED BY DEED POLL X TO "VALUE"
  const fnQuotedSkip = data.match(
    new RegExp(FN_LABEL.source + String.raw`(?:[^"']+?)` + QUOTED.source, 'i')
  )

  // 7. Labelled + unquoted (stops before D.P/DEED/SURNAME/end)
  //    Also handles unclosed-quote forms by stripping leading/trailing quotes:
  //    - CHRISTIAN NAME ' JOHN AVAIKI ... D.P  → JOHN AVAIKI
  //    - CHRISTIAN NAME AGOSTINI INATEA' D.P   → AGOSTINI INATEA
  //    - CHRISTIAN NAME" "NGATAMARIKI TEREPAI  → NGATAMARIKI TEREPAI
  //    - CHRISTIAN NAME: TEOKOTAI ANNA MARGARET" D.P → TEOKOTAI ANNA MARGARET
  const fnUnquoted = data.match(
    new RegExp(
      FN_LABEL.source +
        // skip any leading quote/space junk before the real name
        String.raw`['"'\s]*` +
        // capture: any char except end-of-name sentinels
        String.raw`([A-Z][A-Z0-9\s\-.']+?)` +
        // stop before a trailing quote, D.P ref, DEED, SURNAME, or end
        String.raw`['"']?(?=\s*(?:D[./]P|D\/P|DP\s|DEED|SURNAME|\.|$))`,
      'i'
    )
  )

  // 8. Standalone bare quote — whole entry is the quoted name + optional D.P ref
  //    e.g.  "BLONDIE MATA"   D.P.NO: 4/84
  //    e.g.  ''ANGELINE TANGIMETUA''  D.P 279/1972
  //    Computed unconditionally; the || chain in the resolve block will only use
  //    it when all label-based strategies yield empty.
  const standaloneFn = data.match(
    /^\n?(?:"([^"]+?)"|''([^'"]+?)(?:''|['"]))\s*(?:D[./]P|\s|$)/i
  )

  // ── Surname extraction strategies ─────────────────────────────────────────────

  // 9. Labelled + quoted surname
  const snQuoted = data.match(new RegExp(SN_LABEL.source + QUOTED.source, 'i'))

  // 10. Labelled + quoted with skip (e.g. SURNAME CHANGED BY ... "VALUE")
  const snQuotedSkip = data.match(
    new RegExp(SN_LABEL.source + String.raw`(?:[^"']+?)` + QUOTED.source, 'i')
  )

  // 11. Labelled + unquoted surname (stops before D.P/DEED/end)
  const snUnquoted = data.match(
    new RegExp(
      SN_LABEL.source +
        String.raw`([A-Z][A-Z0-9\s\-.]+?)(?=\s*(?:D[./]P|DEED|\.|$))`,
      'i'
    )
  )

  // ── Resolve ───────────────────────────────────────────────────────────────────
  // Use || chaining so that an empty capture falls through to the next strategy.
  const tryQ = (m: RegExpMatchArray | null) => (m ? pickQ(m) : '')

  const firstname =
    (inlineParenFn ? inlineParenFn[1].trim() : '') ||
    tryQ(parenQuotedFn) ||
    (parenUnquotedFn ? parenUnquotedFn[1].trim() : '') ||
    (beforeParenFn ? beforeParenFn[1].trim() : '') ||
    tryQ(fnQuoted) ||
    tryQ(fnQuotedSkip) ||
    (fnUnquoted ? (fnUnquoted[1]?.trim() ?? '') : '') ||
    (standaloneFn ? (standaloneFn[1] ?? standaloneFn[2] ?? '').trim() : '')

  const surname =
    (inlineParenSn ? inlineParenSn[1].trim() : '') ||
    tryQ(snQuoted) ||
    tryQ(snQuotedSkip) ||
    (snUnquoted ? (snUnquoted[1]?.trim() ?? '') : '')

  // ── Bare-name fallback ────────────────────────────────────────────────────────
  // If nothing matched AND the string doesn't start with a name/surname/christian
  // keyword, treat everything before the first D.P reference as the full name
  // and run it through deriveName (last word → surname, rest → given names).
  if (!firstname && !surname) {
    const startsWithKeyword =
      /^\s*(?:NAME|SURNAME|SURNAM|CHRISTIAN|CRISTIAN|CH\s+N|CN\b)/i.test(data)
    if (!startsWithKeyword) {
      const beforeDP = data
        .replace(/\n/g, ' ')
        .match(/^(.+?)(?=\s*(?:D[./]P|D\/P|DP\s|DEED|$))/i)
      if (beforeDP) {
        const raw = beforeDP[1]
          .trim()
          .replace(/['"().]+/g, '')
          .trim()
        if (raw) return deriveName(raw)
      }
    }
  }

  return toName(firstname, surname)
}
export const latestNameChange = (data: BirthCsvRecord, all: CsvFields) => {
  const deedPoll = lookUpNameChange(all, data.BIRTH_REF)[0]
  const inSheet = getNewName(data.CHILDS_NEW_NAME)
  return deedPoll || inSheet
}

export const birthResolver: BirthResolver = {
  'child.name': (data: BirthCsvRecord) =>
    toName(data.CHILDS_NAME, data.FATHERS_SURNAME || data.MOTHERS_SURNAME),
  'child.dob': (data: BirthCsvRecord) => toCrvsDate(data.CHILDS_DOB),
  'child.reason': (_: BirthCsvRecord) => 'Legacy record', // Confirm this with Shez, maybe Legacy record
  'child.gender': (data: BirthCsvRecord) => toGender(data.CHILDS_GENDER),
  'child.placeOfBirth': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) =>
    resolveFacility(data.CHILDS_BIRTHPLACE, locationMap)
      ? 'HEALTH_FACILITY'
      : 'OTHER',
  'child.birthLocation': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) => resolveFacility(data.CHILDS_BIRTHPLACE, locationMap),
  'child.birthLocation.privateHome': '',
  'child.birthLocation.other': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) => resolveAddress(data.CHILDS_BIRTHPLACE, locationMap),
  'child.birthType': (data: BirthCsvRecord) =>
    twinsMap[data.CHILDS_TWIN]?.type || 'SINGLE',
  'child.orderOfBirth.twins': (data: BirthCsvRecord) =>
    twinsMap[data.CHILDS_TWIN]?.orderTwins,
  'child.orderOfBirth.triplets': (data: BirthCsvRecord) =>
    twinsMap[data.CHILDS_TWIN]?.orderTriplets,
  'child.orderOfBirth.higherMultiple': (data: BirthCsvRecord) =>
    twinsMap[data.CHILDS_TWIN]?.orderHigher,
  'child.weightAtBirth': '',
  'child.attendantAtBirth': (_: BirthCsvRecord) => 'OTHER' as AttendantAtBirth,
  'child.attendantAtBirth.other': (_: BirthCsvRecord) => 'Legacy record',
  'child.attendantAtBirth.givenNames': (_: BirthCsvRecord) => '-',
  'child.attendantAtBirth.surname': (_: BirthCsvRecord) => '-',
  'child.isRenamed': (data: BirthCsvRecord, all: CsvFields) =>
    !!latestNameChange(data, all),
  'child.isAdoptionOrder': (data: BirthCsvRecord) => !!data.ADOP_REC_REF,
  'nameChange.deedPollNumber1': (data: BirthCsvRecord, all: CsvFields) =>
    latestNameChange(data, all)?.DP_REF,
  'nameChange.newGivenNames1': (data: BirthCsvRecord, all: CsvFields) =>
    latestNameChange(data, all)?.firstname,
  'nameChange.newSurname1': (data: BirthCsvRecord, all: CsvFields) =>
    latestNameChange(data, all)?.surname,
  'nameChange.addAnother1': '',
  'nameChange.deedPollNumber2': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[1]?.DP_REF,
  'nameChange.newGivenNames2': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[1]?.firstname,
  'nameChange.newSurname2': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[1]?.surname,
  'nameChange.addAnother2': '',
  'nameChange.deedPollNumber3': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[2]?.DP_REF,
  'nameChange.newGivenNames3': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[2]?.firstname,
  'nameChange.newSurname3': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[2]?.surname,
  'adoptionOrder.registrationNumber': (
    data: BirthCsvRecord,
    all: CsvFields
  ) => {
    if (!data.ADOP_REC_REF) return undefined
    const match = all.adoption.find(
      (record) => record.ADOPTION_REF === data.ADOP_REC_REF
    )
    if (match) {
      return toLegacy(match.ADOPTION_REF, 'adoption')
    }
    return data.ADOP_REC_REF
  },

  'adoptionOrder.orderDocument': '', //(data: BirthCsvRecord) => data.ADOPT_BOOK_REF,

  'mother.detailsUnavailable': (data: BirthCsvRecord) =>
    motherDetailsUnavailable(data),
  'mother.unavailableReason': (data: BirthCsvRecord) =>
    motherDetailsUnavailable(data) ? 'Legacy record' : undefined,
  'mother.name': (data: BirthCsvRecord) =>
    toName(data.MOTHERS_NAME, data.MOTHERS_SURNAME),
  'mother.dob': (data: BirthCsvRecord) => toCrvsDate(data.MOTHERS_DOB),
  'mother.dobUnknown': (data: BirthCsvRecord) =>
    Boolean(!data.MOTHERS_DOB && data.MOTHERS_AGE),
  'mother.age': (data: BirthCsvRecord) => toAge(data.MOTHERS_AGE),
  'mother.maritalStatus': '',
  'mother.maidenName': (data: BirthCsvRecord) =>
    toTitleCase(data.MOTHERS_MAIDEN_NAME),
  'mother.placeOfBirth': (data: BirthCsvRecord) =>
    toTitleCase(data.MOTHERS_BIRTHPLACE),
  'mother.nationality': (data: BirthCsvRecord) =>
    toNationality(data.MOTHERS_NATIONALITY, data.MOTHERS_RACE),
  'mother.idType': (_: BirthCsvRecord) => 'NONE' as IdType,
  'mother.passport': '',
  'mother.bc': '',
  'mother.other': '',
  'mother.address': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) => resolveAddress(data.MOTHERS_ADDRESS, locationMap),
  'mother.occupation': '',
  'father.detailsUnavailable': (data: BirthCsvRecord) =>
    fatherDetailsUnavailable(data),
  'father.unavailableReason': (data: BirthCsvRecord) =>
    fatherDetailsUnavailable(data) ? 'Legacy record' : undefined,
  'father.name': (data: BirthCsvRecord) =>
    toName(data.FATHERS_NAME, data.FATHERS_SURNAME),
  'father.dob': (data: BirthCsvRecord) => toCrvsDate(data.FATHERS_DOB),
  'father.dobUnknown': (data: BirthCsvRecord) =>
    Boolean(!data.FATHERS_DOB && data.FATHERS_AGE),
  'father.age': (data: BirthCsvRecord) => toAge(data.FATHERS_AGE),
  'father.placeOfBirth': (data: BirthCsvRecord) =>
    toTitleCase(data.FATHERS_BIRTHPLACE),
  'father.nationality': (data: BirthCsvRecord) =>
    toNationality(data.FATHERS_NATIONALITY, data.FATHERS_RACE),
  'father.idType': (_: BirthCsvRecord) => 'NONE' as IdType,
  'father.passport': '',
  'father.bc': '',
  'father.other': '',
  'father.sameAsMotherResidence': '', // Calculate
  'father.address': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) => resolveAddress(data.FATHERS_ADDRESS, locationMap),
  'father.occupation': (data: BirthCsvRecord) => data.FATHERS_OCCUPATION,
  'informant.relation': (data: BirthCsvRecord): BirthInformant => {
    const relation = data.INFORMANTS_RELATIONSHIP || ''
    return birthInformantMap[relation] || 'OTHER'
  },
  'informant.other.relation': (data: BirthCsvRecord) => {
    const relation = birthInformantMap[data.INFORMANTS_RELATIONSHIP || '']
    return relation === 'OTHER' ? data.INFORMANTS_RELATIONSHIP : null
  },
  'informant.name': (data: BirthCsvRecord) => deriveName(data.INFORMANTS_NAME),
  'informant.dob': '',
  'informant.dobUnknown': '',
  'informant.age': '',
  'informant.nationality': '',
  'informant.idType': '',
  'informant.passport': '',
  'informant.bc': '',
  'informant.other': '',
  'informant.address': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) => resolveAddress(data.INFORMANTS_ADDRESS, locationMap),
  'informant.occupation': (data: BirthCsvRecord) => data.INFORMANTS_OCCUPATION,
  'informant.phoneNo': '',
  'informant.email': ''
}

export const birthMetaData: BirthMetaData = {
  registrationDate: (data: BirthCsvRecord) => toISODate(data.DATE_REGISTERED),
  locationCode: (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) =>
    getLocationCode(data.CHILDS_BIRTHPLACE, locationMap) ||
    getLocationFromRegNum(data.BIRTH_REF)
}
