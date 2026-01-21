import { parse } from '@std/csv/parse'
import { TextLineStream } from '@std/streams/text-line-stream'

export async function readCsvHeader(path: string): Promise<string[]> {
  const file = await Deno.open(path)

  try {
    const lineStream = file.readable
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TextLineStream())

    // Read only the first line
    for await (const line of lineStream) {
      // Parse the first line as CSV
      const rows = parse(line as string, { skipFirstRow: false })
      const headers = rows[0] as string[]
      return headers
    }

    // Return empty array if file is empty
    return []
  } finally {
    file.close()
  }
}

export async function csvToJson(path: string, lines?: number): Promise<any[]> {
  // Read the entire file content
  const content = await Deno.readTextFile(path)

  // Parse the entire CSV at once
  const results = parse(content, { skipFirstRow: true })

  // If lines parameter is provided, return only the specified number of rows
  if (lines !== undefined) {
    return results.slice(0, lines)
  }

  return results
}
