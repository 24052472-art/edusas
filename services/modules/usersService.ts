import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore'
import { db } from '../core/firebase'
import { User } from '@/types/user'
import { UserRole } from '@/types/common'
import { FIRESTORE_COLLECTIONS, PAGINATION_LIMIT } from '@/lib/constants'

const usersCol = collection(db, FIRESTORE_COLLECTIONS.USERS)

export async function getUserById(id: string): Promise<User | null> {
  const docSnap = await getDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, id))
  if (docSnap.exists()) return docSnap.data() as User
  return null
}

export async function getAllUsers(pageLimit = PAGINATION_LIMIT): Promise<User[]> {
  const q = query(usersCol, orderBy('createdAt', 'desc'), limit(pageLimit))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => d.data() as User)
}

export async function getUsersByRole(role: UserRole): Promise<User[]> {
  const q = query(usersCol, where('role', '==', role))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => d.data() as User)
}

export async function blockUser(uid: string, blocked: boolean): Promise<void> {
  await updateDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, uid), { blocked, updatedAt: new Date().toISOString() })
}

export async function verifyUser(uid: string, verified: boolean): Promise<void> {
  await updateDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, uid), { verified, updatedAt: new Date().toISOString() })
}

export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  await updateDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, uid), { role, updatedAt: new Date().toISOString() })
}

export async function saveNote(userId: string, noteId: string): Promise<void> {
  await updateDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, userId), {
    savedNotes: arrayUnion(noteId),
    'stats.totalSaved': increment(1),
  })
}

export async function unsaveNote(userId: string, noteId: string): Promise<void> {
  await updateDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, userId), {
    savedNotes: arrayRemove(noteId),
    'stats.totalSaved': increment(-1),
  })
}

export async function recordDownload(userId: string, noteId: string): Promise<void> {
  await updateDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, userId), {
    downloadHistory: arrayUnion(noteId),
    'stats.totalDownloads': increment(1),
    'stats.lastActive': new Date().toISOString(),
  })
}

export function subscribeToUser(uid: string, callback: (user: User | null) => void): () => void {
  return onSnapshot(doc(db, FIRESTORE_COLLECTIONS.USERS, uid), snapshot => {
    if (snapshot.exists()) callback(snapshot.data() as User)
    else callback(null)
  })
}
