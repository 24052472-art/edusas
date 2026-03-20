import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/services/core/firebase';
import { Notification, NotificationType } from '@/types';
import { COLLECTIONS } from '@/lib/constants';

export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  data?: Notification['data']
): Promise<void> => {
  const notificationsRef = collection(db, COLLECTIONS.NOTIFICATIONS);
  await addDoc(notificationsRef, {
    userId,
    type,
    title,
    message,
    read: false,
    data: data || {},
    createdAt: serverTimestamp(),
  });
};

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  const q = query(
    collection(db, COLLECTIONS.NOTIFICATIONS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Notification));
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  const notifRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
  await updateDoc(notifRef, { read: true });
};

export const markAllAsRead = async (userId: string): Promise<void> => {
  const q = query(
    collection(db, COLLECTIONS.NOTIFICATIONS),
    where('userId', '==', userId),
    where('read', '==', false)
  );
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);
  snapshot.docs.forEach((doc) => {
    batch.update(doc.ref, { read: true });
  });
  await batch.commit();
};

export const subscribeToNotifications = (
  userId: string,
  callback: (notifications: Notification[]) => void
) => {
  const q = query(
    collection(db, COLLECTIONS.NOTIFICATIONS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Notification));
    callback(notifications);
  });
};
