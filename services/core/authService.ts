import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { User } from '@/types/user'
import { UserRole } from '@/types/common'
import { FIRESTORE_COLLECTIONS } from '@/lib/constants'

const googleProvider = new GoogleAuthProvider()

export async function signInWithGoogle(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, googleProvider)
  return result.user
}

export async function signOutUser(): Promise<void> {
  await signOut(auth)
}

export async function getUserProfile(uid: string): Promise<User | null> {
  const docRef = doc(db, FIRESTORE_COLLECTIONS.USERS, uid)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data() as User
  }
  return null
}

export async function createUserProfile(firebaseUser: FirebaseUser, role: UserRole): Promise<User> {
  const userProfile: User = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || 'Anonymous',
    photoURL: firebaseUser.photoURL,
    role,
    verified: false,
    blocked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    savedNotes: [],
    followingTeachers: [],
    enrolledBranches: [],
    downloadHistory: [],
    stats: {
      totalDownloads: 0,
      totalSaved: 0,
      studyStreak: 0,
      lastActive: new Date().toISOString(),
    },
  }

  await setDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, firebaseUser.uid), userProfile)
  return userProfile
}

export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  await updateDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, uid), {
    role,
    updatedAt: new Date().toISOString(),
  })
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback)
}
