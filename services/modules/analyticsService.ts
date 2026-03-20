import {
  collection,
  getDocs,
  query,
  where,
  getCountFromServer,
} from 'firebase/firestore'
import { db } from '../core/firebase'
import { FIRESTORE_COLLECTIONS } from '@/lib/constants'

export interface PlatformStats {
  totalUsers: number
  totalTeachers: number
  totalNotes: number
  pendingNotes: number
  totalDownloads: number
  activeUsers: number
}

export async function getPlatformStats(): Promise<PlatformStats> {
  const [usersSnap, teachersSnap, notesSnap, pendingSnap] = await Promise.all([
    getCountFromServer(collection(db, FIRESTORE_COLLECTIONS.USERS)),
    getCountFromServer(query(collection(db, FIRESTORE_COLLECTIONS.USERS), where('role', '==', 'teacher'))),
    getCountFromServer(query(collection(db, FIRESTORE_COLLECTIONS.NOTES), where('status', '==', 'approved'))),
    getCountFromServer(query(collection(db, FIRESTORE_COLLECTIONS.NOTES), where('status', '==', 'pending'))),
  ])

  return {
    totalUsers: usersSnap.data().count,
    totalTeachers: teachersSnap.data().count,
    totalNotes: notesSnap.data().count,
    pendingNotes: pendingSnap.data().count,
    totalDownloads: 0,
    activeUsers: 0,
  }
}

export async function getTeacherStats(teacherId: string) {
  const notesSnap = await getDocs(
    query(
      collection(db, FIRESTORE_COLLECTIONS.NOTES),
      where('uploadedBy', '==', teacherId)
    )
  )
  const notes = notesSnap.docs.map(d => d.data())
  const totalDownloads = notes.reduce((sum, n) => sum + (n.downloads || 0), 0)
  const totalViews = notes.reduce((sum, n) => sum + (n.views || 0), 0)

  return {
    totalUploads: notes.length,
    totalDownloads,
    totalViews,
    approvedNotes: notes.filter(n => n.status === 'approved').length,
    pendingNotes: notes.filter(n => n.status === 'pending').length,
  }
}
