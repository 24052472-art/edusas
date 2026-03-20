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
  serverTimestamp,
  increment,
  DocumentSnapshot,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/services/core/firebase';
import { Note, NoteCategory } from '@/types';
import { COLLECTIONS, PAGINATION_LIMIT } from '@/lib/constants';

export const createNote = async (
  noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'downloads' | 'rating' | 'ratingCount' | 'views'>
): Promise<string> => {
  const notesRef = collection(db, COLLECTIONS.NOTES);
  const docRef = await addDoc(notesRef, {
    ...noteData,
    downloads: 0,
    rating: 0,
    ratingCount: 0,
    views: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateNote = async (id: string, data: Partial<Note>): Promise<void> => {
  const noteRef = doc(db, COLLECTIONS.NOTES, id);
  await updateDoc(noteRef, { ...data, updatedAt: serverTimestamp() });
};

export const deleteNote = async (id: string): Promise<void> => {
  const noteRef = doc(db, COLLECTIONS.NOTES, id);
  await deleteDoc(noteRef);
};

export const getNoteById = async (id: string): Promise<Note | null> => {
  const noteRef = doc(db, COLLECTIONS.NOTES, id);
  const noteSnap = await getDoc(noteRef);
  if (!noteSnap.exists()) return null;
  return { id: noteSnap.id, ...noteSnap.data() } as Note;
};

export const getApprovedNotes = async (
  filters?: {
    branchId?: string;
    subjectId?: string;
    category?: NoteCategory;
    lastDoc?: DocumentSnapshot;
  }
): Promise<{ notes: Note[]; lastDoc: DocumentSnapshot | null }> => {
  const constraints: QueryConstraint[] = [
    where('status', '==', 'approved'),
    orderBy('createdAt', 'desc'),
    limit(PAGINATION_LIMIT),
  ];

  if (filters?.branchId) constraints.push(where('branchId', '==', filters.branchId));
  if (filters?.subjectId) constraints.push(where('subjectId', '==', filters.subjectId));
  if (filters?.category) constraints.push(where('category', '==', filters.category));
  if (filters?.lastDoc) constraints.push(startAfter(filters.lastDoc));

  const q = query(collection(db, COLLECTIONS.NOTES), ...constraints);
  const snapshot = await getDocs(q);

  const notes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Note));
  const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

  return { notes, lastDoc };
};

export const getPendingNotes = async (): Promise<Note[]> => {
  const q = query(
    collection(db, COLLECTIONS.NOTES),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Note));
};

export const approveNote = async (id: string): Promise<void> => {
  await updateNote(id, { status: 'approved' });
};

export const rejectNote = async (id: string): Promise<void> => {
  await updateNote(id, { status: 'draft' });
};

export const incrementDownloads = async (id: string): Promise<void> => {
  const noteRef = doc(db, COLLECTIONS.NOTES, id);
  await updateDoc(noteRef, { downloads: increment(1) });
};

export const incrementViews = async (id: string): Promise<void> => {
  const noteRef = doc(db, COLLECTIONS.NOTES, id);
  await updateDoc(noteRef, { views: increment(1) });
};

export const subscribeToApprovedNotes = (
  callback: (notes: Note[]) => void,
  filters?: { branchId?: string; category?: NoteCategory }
) => {
  const constraints: QueryConstraint[] = [
    where('status', '==', 'approved'),
    orderBy('createdAt', 'desc'),
    limit(20),
  ];

  if (filters?.branchId) constraints.push(where('branchId', '==', filters.branchId));
  if (filters?.category) constraints.push(where('category', '==', filters.category));

  const q = query(collection(db, COLLECTIONS.NOTES), ...constraints);

  return onSnapshot(q, (snapshot) => {
    const notes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Note));
    callback(notes);
  });
};

export const getTeacherNotes = async (teacherId: string): Promise<Note[]> => {
  const q = query(
    collection(db, COLLECTIONS.NOTES),
    where('uploadedBy', '==', teacherId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Note));
};
