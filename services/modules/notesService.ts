import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  increment,
  DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '../core/firebase'
import { Note, NoteFilter } from '@/types/note'
import { FIRESTORE_COLLECTIONS, PAGINATION_LIMIT } from '@/lib/constants'

const notesCol = collection(db, FIRESTORE_COLLECTIONS.NOTES)

export async function createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(notesCol, {
    ...note,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  await updateDoc(docRef, { id: docRef.id })
  return docRef.id
}

export async function getNoteById(id: string): Promise<Note | null> {
  const docRef = doc(db, FIRESTORE_COLLECTIONS.NOTES, id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) return docSnap.data() as Note
  return null
}

export async function getNotes(
  filters: NoteFilter = {},
  pageLimit = PAGINATION_LIMIT,
  lastDoc?: DocumentSnapshot
): Promise<{ notes: Note[]; lastDoc: DocumentSnapshot | null }> {
  let q = query(notesCol, orderBy('createdAt', 'desc'), limit(pageLimit))

  if (filters.branchId) q = query(q, where('branchId', '==', filters.branchId))
  if (filters.subjectId) q = query(q, where('subjectId', '==', filters.subjectId))
  if (filters.category) q = query(q, where('category', '==', filters.category))
  if (filters.status) q = query(q, where('status', '==', filters.status))
  if (lastDoc) q = query(q, startAfter(lastDoc))

  const snapshot = await getDocs(q)
  const notes = snapshot.docs.map(d => d.data() as Note)
  const last = snapshot.docs[snapshot.docs.length - 1] || null

  return { notes, lastDoc: last }
}

export async function updateNote(id: string, updates: Partial<Note>): Promise<void> {
  await updateDoc(doc(db, FIRESTORE_COLLECTIONS.NOTES, id), {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

export async function deleteNote(id: string): Promise<void> {
  await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.NOTES, id))
}

export async function incrementDownloads(noteId: string): Promise<void> {
  await updateDoc(doc(db, FIRESTORE_COLLECTIONS.NOTES, noteId), {
    downloads: increment(1),
  })
}

export function subscribeToNotes(
  filters: NoteFilter,
  callback: (notes: Note[]) => void
): () => void {
  let q = query(notesCol, where('status', '==', 'approved'), orderBy('createdAt', 'desc'), limit(20))
  if (filters.branchId) q = query(q, where('branchId', '==', filters.branchId))

  return onSnapshot(q, snapshot => {
    const notes = snapshot.docs.map(d => d.data() as Note)
    callback(notes)
  })
}

export async function approveNote(id: string): Promise<void> {
  await updateNote(id, { status: 'approved' })
}

export async function rejectNote(id: string): Promise<void> {
  await updateNote(id, { status: 'rejected' })
}
