import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User, UserRole } from '@/types';
import { COLLECTIONS } from '@/lib/constants';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<User> => {
  const result = await signInWithPopup(auth, googleProvider);
  const firebaseUser = result.user;

  const userRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const newUser: Omit<User, 'uid'> = {
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName!,
      photoURL: firebaseUser.photoURL || undefined,
      role: 'student',
      verified: false,
      createdAt: new Date(),
      following: [],
      savedNotes: [],
      downloadHistory: [],
      blocked: false,
    };
    await setDoc(userRef, { ...newUser, createdAt: serverTimestamp() });
    return { uid: firebaseUser.uid, ...newUser };
  }

  return { uid: firebaseUser.uid, ...userSnap.data() } as User;
};

export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const getCurrentUser = async (uid: string): Promise<User | null> => {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return null;
  return { uid, ...userSnap.data() } as User;
};

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const updateUserRole = async (uid: string, role: UserRole): Promise<void> => {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  await updateDoc(userRef, { role });
};

export const updateUserProfile = async (uid: string, data: Partial<User>): Promise<void> => {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  await updateDoc(userRef, { ...data });
};
