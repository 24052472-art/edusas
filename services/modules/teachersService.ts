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
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { db } from '../core/firebase'
import { Teacher } from '@/types/teacher'
import { FIRESTORE_COLLECTIONS } from '@/lib/constants'

const teachersCol = collection(db, FIRESTORE_COLLECTIONS.TEACHERS)

export async function getTeacherById(id: string): Promise<Teacher | null> {
  const docSnap = await getDoc(doc(db, FIRESTORE_COLLECTIONS.TEACHERS, id))
  if (docSnap.exists()) return docSnap.data() as Teacher
  return null
}

export async function getAllTeachers(): Promise<Teacher[]> {
  const q = query(teachersCol)
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => d.data() as Teacher)
}

export async function getTeachersByBranch(branchId: string): Promise<Teacher[]> {
  const q = query(teachersCol, where('branches', 'array-contains', branchId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => d.data() as Teacher)
}

export async function followTeacher(userId: string, teacherId: string): Promise<void> {
  await updateDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, userId), {
    followingTeachers: arrayUnion(teacherId),
  })
  await updateDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, teacherId), {
    'followers': increment(1),
  })
}

export async function unfollowTeacher(userId: string, teacherId: string): Promise<void> {
  await updateDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, userId), {
    followingTeachers: arrayRemove(teacherId),
  })
  await updateDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, teacherId), {
    'followers': increment(-1),
  })
}

export async function verifyTeacher(uid: string, verified: boolean): Promise<void> {
  await updateDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, uid), { verified, updatedAt: new Date().toISOString() })
}

export function subscribeToTeachers(callback: (teachers: Teacher[]) => void): () => void {
  const q = query(teachersCol, orderBy('followers', 'desc'), limit(20))
  return onSnapshot(q, snapshot => {
    const teachers = snapshot.docs.map(d => d.data() as Teacher)
    callback(teachers)
  })
}
