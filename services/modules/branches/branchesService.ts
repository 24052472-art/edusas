import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db } from '@/services/core/firebase';
import { Branch, Subject } from '@/types';
import { COLLECTIONS } from '@/lib/constants';

export const getBranches = async (): Promise<Branch[]> => {
  const q = query(collection(db, COLLECTIONS.BRANCHES), orderBy('name'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Branch));
};

export const getBranchById = async (id: string): Promise<Branch | null> => {
  const branchRef = doc(db, COLLECTIONS.BRANCHES, id);
  const branchSnap = await getDoc(branchRef);
  if (!branchSnap.exists()) return null;
  return { id, ...branchSnap.data() } as Branch;
};

export const createBranch = async (
  data: Omit<Branch, 'id' | 'createdAt' | 'subjectCount' | 'noteCount'>
): Promise<string> => {
  const branchesRef = collection(db, COLLECTIONS.BRANCHES);
  const docRef = await addDoc(branchesRef, {
    ...data,
    subjectCount: 0,
    noteCount: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getSubjects = async (branchId: string): Promise<Subject[]> => {
  const q = query(
    collection(db, COLLECTIONS.SUBJECTS),
    where('branchId', '==', branchId),
    orderBy('name')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Subject));
};

export const createSubject = async (
  data: Omit<Subject, 'id' | 'createdAt' | 'noteCount'>
): Promise<string> => {
  const subjectsRef = collection(db, COLLECTIONS.SUBJECTS);
  const docRef = await addDoc(subjectsRef, {
    ...data,
    noteCount: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getAllSubjects = async (): Promise<Subject[]> => {
  const q = query(collection(db, COLLECTIONS.SUBJECTS), orderBy('name'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Subject));
};
