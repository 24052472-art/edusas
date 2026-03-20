import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../core/firebase'
import { Branch, Subject } from '@/types/branch'
import { FIRESTORE_COLLECTIONS } from '@/lib/constants'

const branchesCol = collection(db, FIRESTORE_COLLECTIONS.BRANCHES)

export async function getAllBranches(): Promise<Branch[]> {
  const q = query(branchesCol, orderBy('name'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as Branch)
}

export async function getBranchById(id: string): Promise<Branch | null> {
  const docSnap = await getDoc(doc(db, FIRESTORE_COLLECTIONS.BRANCHES, id))
  if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() } as Branch
  return null
}

export async function createBranch(branch: Omit<Branch, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(branchesCol, {
    ...branch,
    createdAt: new Date().toISOString(),
  })
  return docRef.id
}

export async function createSubject(subject: Omit<Subject, 'id' | 'createdAt'>): Promise<string> {
  const subjectsCol = collection(db, FIRESTORE_COLLECTIONS.SUBJECTS)
  const docRef = await addDoc(subjectsCol, {
    ...subject,
    createdAt: new Date().toISOString(),
  })
  return docRef.id
}

export async function getSubjectsByBranch(branchId: string): Promise<Subject[]> {
  const subjectsCol = collection(db, FIRESTORE_COLLECTIONS.SUBJECTS)
  const snapshot = await getDocs(query(subjectsCol, orderBy('name')))
  return snapshot.docs
    .map(d => ({ id: d.id, ...d.data() }) as Subject)
    .filter(s => s.branchId === branchId)
}

export function subscribeToBranches(callback: (branches: Branch[]) => void): () => void {
  return onSnapshot(query(branchesCol, orderBy('name')), snapshot => {
    const branches = snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as Branch)
    callback(branches)
  })
}
