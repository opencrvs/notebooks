/*
Formats include;
"CHRISTIAN NAME \" HENRY TEKERANGI\" D.P NO: 117/2011 -7.1.2.2011"
"CHRISTIAN NAME CHANGED: \"BILLY NOOANGATAU TEREAPII\" D/P NO: 9/90. 9/1/1990. SURNAME CHANGED: \"ARAIPU\" D/P NO: 9/90. 9/1/1990.",
"CHRISTIAN NAME:  \"ANNA\"      SURNAME:  \"ERNEST\"     D.P.NO:  98/2022      -    07.11.2022",
*/

import { deriveName, toTitleCase } from './resolverHelpers.ts'

// Normalize typographic/paired and mismatched quotes to straight double quotes.
// Steps applied in order:
//   1. Mismatched pairs 'TEXT" or "TEXT' → "TEXT"
//   2. Single-quoted pairs 'TEXT' → "TEXT"
//   3. '' (two consecutive straight single quotes) → "
//   4. Unicode curly doubles ("") → "
//   5. Unicode curly singles (' ') → '
const normalizeQuotes = (s: string): string =>
  s
    .replace(/'([^'"]+)"/g, '"$1"') // 'TEXT" → "TEXT"
    .replace(/"([^'"]+)'/g, '"$1"') // "TEXT' → "TEXT"
    .replace(/'([^']+?)'/g, '"$1"') // 'TEXT' → "TEXT"
    .replace(/''|[\u201C\u201D""]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")

// CN keyword variants: CHRISTIAN NAME, CHRISTIAN NAME CHANGED,
//                      CHRISTIAN NAME ADDED BY ..., CN:
const CN_KW = /CHRISTIAN\s+NAME(?:\s+\w+)*\s*[:\s]|CN\s*:/i

// SN keyword variants: SURNAME, SURNAME CHANGED, SN:
const SN_KW = /SURNAME(?:\s+CHANGED)?\s*[:\s]|SN\s*:/i

/**
 * Given a chunk of text associated with one DP number, extract firstname and
 * surname. Rules are applied in priority order; simpler/more explicit rules
 * come first.
 *
 * Rule 1 (CN + quoted): CN keyword present → grab the first quoted value in chunk
 * Rule 2 (SN + quoted): SN keyword present → grab the quoted value after SN keyword
 * Rule 3 (CN + unquoted): CN keyword followed by plain text up to a DP delimiter
 * Rule 4 (SN + unquoted): SN keyword followed by plain text up to a DP delimiter
 * Rule 5 (bare quoted, no keywords): single quoted value with no CN/SN → firstname
 */
const extractNames = (
  chunk: string
): { firstname: string; surname: string } => {
  let firstname = ''
  let surname = ''

  const hasCN = CN_KW.test(chunk)
  const hasSN = SN_KW.test(chunk)

  // Rule 1: CN keyword + any quoted value anywhere in chunk
  if (hasCN) {
    const quoted = chunk.match(/"([^"]+)"/)
    if (quoted) firstname = toTitleCase(quoted[1].trim())
  }

  // Rule 2: SN keyword + quoted value after the SN keyword
  if (hasSN) {
    const snQuoted = chunk.match(
      /(?:SURNAME(?:\s+CHANGED)?\s*[:\s]|SN\s*:)\s*"([^"]+)"/i
    )
    if (snQuoted) {
      surname = toTitleCase(snQuoted[1].trim())
    } else {
      // Multiple quoted values? Take the last one after SN keyword
      const snIdx = chunk.search(SN_KW)
      const afterSN = chunk.substring(snIdx)
      const snQ = afterSN.match(/"([^"]+)"/)
      if (snQ) surname = toTitleCase(snQ[1].trim())
    }
  }

  // Rule 3: CN keyword + unquoted name
  // Value lies between the CN keyword and any of: DP ref, SURNAME, a period, a quote, or end
  if (hasCN && !firstname) {
    const cnUnquoted = chunk.match(
      /(?:CHRISTIAN\s+NAME(?:\s+\w+)*\s*[:\s]|CN\s*:)\s*([A-Z][A-Z\s]+?)(?=[.""]|\s+(?:D[./]?P|DEED\s+POLL|SURNAME|SN\s*:)|$)/i
    )
    if (cnUnquoted) {
      firstname = toTitleCase(cnUnquoted[1].trim().replace(/[.\s"']+$/, ''))
    }
  }

  // Rule 4: SN keyword + unquoted name
  // Value lies between the SN keyword and any of: DP ref, CN, a period, a quote, or end
  if (hasSN && !surname) {
    const snUnquoted = chunk.match(
      /(?:SURNAME(?:\s+CHANGED)?\s*[:\s]|SN\s*:)\s*([A-Z][A-Z\s]+?)(?=[.""]|\s+(?:D[./]?P|DEED\s+POLL|CHRISTIAN\s+NAME|CN\s*:)|$)/i
    )
    if (snUnquoted) {
      surname = toTitleCase(snUnquoted[1].trim().replace(/[.\s"']+$/, ''))
    }
  }

  // Rule 5: bare quoted value, no CN/SN keywords → derive firstname/surname
  if (!hasCN && !hasSN && !firstname) {
    const quoted = chunk.match(/"([^"]+)"/)
    if (quoted) {
      const derived = deriveName(quoted[1].trim())
      firstname = derived.firstname
      surname = derived.surname
    }
  }

  // Rule 6: no CN/SN keywords, no quotes, no name found yet
  // Strip DP references and dates from the chunk; if the remainder is plain
  // text (letters, spaces, hyphens) pass it through deriveName
  if (!hasCN && !hasSN && !firstname && !surname) {
    const stripped = chunk
      .replace(
        /(?:DEED\s+POLL\s*(?:NO\.?\s*|NUMBER\s*)?:?\s*|D[./]?P[./]?N?[./]?O?\.?\s*(?:NO\.?\s*)?:?\s*)[\dA-Z/]*/gi,
        ''
      )
      .replace(/\b\d[\d./]+\b/g, '') // remove stray date-like tokens
      .trim()
    if (/^[A-Za-z\s-]+$/.test(stripped) && stripped.length > 0) {
      const derived = deriveName(stripped)
      firstname = derived.firstname
      surname = derived.surname
    }
  }

  return { firstname, surname }
}

export const resolveNameChange = (
  data: string
): { firstname: string; surname: string; dpNo: string }[] => {
  if (!data?.trim()) return []

  // Normalize all quote variants to straight double quotes
  const normalized = normalizeQuotes(data)

  // DP number pattern covers variants:
  //   D.P.NO:, D/P NO:, D.P.N:, D.P. NO:, D.P NO:, DP NO:, D.P.
  //   DEED POLL, DEED POLL NO:, DEED POLL NUMBER
  // Number must be present and digits-only (e.g. 117/2011).
  // Dates (two slashes dd/mm/yyyy) excluded via negative lookahead.
  const dpPattern =
    /(?:DEED\s+POLL\s*(?:NO\.?\s*|NUMBER\s*)?:?\s*|D[./]?P[./]?N?[./]?O?\.?\s*(?:NO\.?\s*)?:?\s*)(\d+\/\d+)(?!\/\d)/gi

  // Bare DP keyword with no valid number following (e.g. "D.P.NO:" at end, or "69A/14")
  const dpKeywordPattern =
    /(?:DEED\s+POLL\s*(?:NO\.?\s*|NUMBER\s*)?:?\s*|D[./]?P[./]?N?[./]?O?\.?\s*(?:NO\.?\s*)?:?\s*)(?!\d+\/\d)/gi

  // Collect all DP matches with positions
  const dpMatches: { index: number; end: number; dpNo: string }[] = []
  let m: RegExpExecArray | null
  while ((m = dpPattern.exec(normalized)) !== null) {
    dpMatches.push({
      index: m.index,
      end: m.index + m[0].length,
      dpNo: m[1]
    })
  }

  // If no numbered DP found, fall back to bare DP keyword — name still extractable, dpNo ''
  if (dpMatches.length === 0) {
    let k: RegExpExecArray | null
    while ((k = dpKeywordPattern.exec(normalized)) !== null) {
      dpMatches.push({ index: k.index, end: k.index + k[0].length, dpNo: '' })
    }
  }

  const results: { firstname: string; surname: string; dpNo: string }[] = []

  for (let i = 0; i < dpMatches.length; i++) {
    const { dpNo } = dpMatches[i]

    // Chunk = text from previous DP end up to end of this DP's post-text.
    // This ensures the name placed *after* the DP ref is included.
    const chunkStart = i === 0 ? 0 : dpMatches[i - 1].end
    const chunkEnd =
      i + 1 < dpMatches.length ? dpMatches[i + 1].index : normalized.length
    const chunk = normalized.substring(chunkStart, chunkEnd)

    const { firstname, surname } = extractNames(chunk)

    // If the same DP number already exists (e.g. CHRISTIAN NAME CHANGED: "X"
    // D/P NO: 9/90 ... SURNAME CHANGED: "Y" D/P NO: 9/90), merge fields
    const existing = results.find((r) => r.dpNo === dpNo)
    if (existing) {
      if (firstname && !existing.firstname) existing.firstname = firstname
      if (surname && !existing.surname) existing.surname = surname
    } else {
      results.push({ firstname, surname, dpNo })
    }
  }

  // No DP reference at all — still try to extract names from the whole string
  if (results.length === 0) {
    const { firstname, surname } = extractNames(normalized)
    if (firstname || surname) {
      results.push({ firstname, surname, dpNo: '' })
    }
  }

  // Last resort: if string is purely letters, spaces and hyphens, treat the
  // whole value as a name and derive firstname/surname from it
  if (results.length === 0 && /^[A-Za-z\s-]+$/.test(normalized.trim())) {
    const { firstname, surname } = deriveName(normalized.trim())
    if (firstname || surname) {
      results.push({ firstname, surname, dpNo: '' })
    }
  }

  return results
}
