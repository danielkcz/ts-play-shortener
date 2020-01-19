import * as Moniker from 'moniker'
import { findEntryBySource, addEntry } from './store'
import { isoDate } from './util'
import { addMonths } from 'date-fns'

export function createSlug(entropy: string): string {
  const name = Moniker.choose()
  const salt = Buffer.from(entropy)
    .toString('base64')
    .replace('/', '')
    .substring(0, 4)
  return `${name}-${salt}`
}

export async function handleNewEntry(source: string): Promise<string | null> {
  // ? is it fast enough to lookup by long string or should we calculate some hash instead?
  const entry = await findEntryBySource(source)
  if (entry) {
    return entry.slug
  }

  try {
    const slug = createSlug(source)
    await addEntry({
      slug,
      source,
      createdAt: isoDate(),
      expiresAt: isoDate(addMonths(new Date(), 6)),
    })
    return slug
  } catch (err) {
    // TODO: Retry creation until it succeeds in case of duplicate slug
    console.error(`failed: ${err.message}`)
    return null
  }
}
