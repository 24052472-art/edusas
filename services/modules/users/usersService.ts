import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore';
import { db } from '@/services/core/firebase';
import { User, UserRole } from '@/types';
import { COLLECTIONS } from '@/lib/constants';

export const getAllUsers = async (): Promise<User[]> => {
  const q = query(collection(db, COLLECTIONS.USERS), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() } as User));
};

export const getUserById = async (uid: string): Promise<User | null> => {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return null;
  return { uid, ...userSnap.data() } as User;
};

export const blockUser = async (uid: string): Promise<void> => {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  await updateDoc(userRef, { blocked: true });
};

export const unblockUser = async (uid: string): Promise<void> => {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  await updateDoc(userRef, { blocked: false });
};

export const verifyUser = async (uid: string): Promise<void> => {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  await updateDoc(userRef, { verified: true });
};

export const unverifyUser = async (uid: string): Promise<void> => {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  await updateDoc(userRef, { verified: false });
};

export const assignRole = async (uid: string, role: UserRole): Promise<void> => {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  await updateDoc(userRef, { role });
};

export const saveNote = async (userId: string, noteId: string): Promise<void> => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  await updateDoc(userRef, { savedNotes: arrayUnion(noteId) });
};

export const unsaveNote = async (userId: string, noteId: string): Promise<void> => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  await updateDoc(userRef, { savedNotes: arrayRemove(noteId) });
};

export const addToDownloadHistory = async (userId: string, noteId: string): Promise<void> => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  await updateDoc(userRef, { downloadHistory: arrayUnion(noteId) });
};

export const followTeacher = async (userId: string, teacherId: string): Promise<void> => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  const teacherRef = doc(db, COLLECTIONS.USERS, teacherId);
  await updateDoc(userRef, { following: arrayUnion(teacherId) });
  await updateDoc(teacherRef, { followers: increment(1) });
};

export const unfollowTeacher = async (userId: string, teacherId: string): Promise<void> => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  const teacherRef = doc(db, COLLECTIONS.USERS, teacherId);
  await updateDoc(userRef, { following: arrayRemove(teacherId) });
  await updateDoc(teacherRef, { followers: increment(-1) });
};

export const getTeachers = async (): Promise<User[]> => {
  const q = query(
    collection(db, COLLECTIONS.USERS),
    where('role', '==', 'teacher'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() } as User));
};
