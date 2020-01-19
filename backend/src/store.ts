import * as admin from 'firebase-admin'
import { TEntry } from './types'

export function getStore() {
  return admin.firestore().collection('store')
}

export async function addEntry(entry: TEntry): Promise<void> {
  const store = getStore()
  await store.doc(entry.slug).create(entry)
}

export async function getEntry(slug: string): Promise<TEntry | null> {
  const store = getStore()
  const snapshot = await store.doc(slug).get()
  return snapshot.exists ? (snapshot.data() as TEntry) : null
}

export async function findEntryBySource(source: string): Promise<TEntry | null> {
  const store = getStore()
  const snapshot = await store
    .where('source', '==', source)
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get()
  if (snapshot.empty) {
    return null
  }
  const [first] = snapshot.docs
  return first.data() as TEntry
}
