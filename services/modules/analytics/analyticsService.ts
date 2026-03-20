import {
  collection,
  getDocs,
  query,
  where,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '@/services/core/firebase';
import { AnalyticsData } from '@/types';
import { COLLECTIONS } from '@/lib/constants';

export const getSystemAnalytics = async (): Promise<AnalyticsData> => {
  const [usersSnap, notesSnap, pendingSnap, teachersSnap] = await Promise.all([
    getCountFromServer(collection(db, COLLECTIONS.USERS)),
    getCountFromServer(collection(db, COLLECTIONS.NOTES)),
    getCountFromServer(
      query(collection(db, COLLECTIONS.NOTES), where('status', '==', 'pending'))
    ),
    getCountFromServer(
      query(collection(db, COLLECTIONS.USERS), where('role', '==', 'teacher'))
    ),
  ]);

  const notesSnapshot = await getDocs(collection(db, COLLECTIONS.NOTES));
  let totalDownloads = 0;
  notesSnapshot.docs.forEach((doc) => {
    totalDownloads += doc.data().downloads || 0;
  });

  return {
    totalUsers: usersSnap.data().count,
    totalNotes: notesSnap.data().count,
    totalDownloads,
    pendingApprovals: pendingSnap.data().count,
    totalTeachers: teachersSnap.data().count,
    activeUsers: usersSnap.data().count,
  };
};
