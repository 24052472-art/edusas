import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../core/firebase'
import { Notification } from '@/types/notification'
import { FIRESTORE_COLLECTIONS } from '@/lib/constants'

const notifCol = collection(db, FIRESTORE_COLLECTIONS.NOTIFICATIONS)

export async function createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(notifCol, {
    ...notification,
    read: false,
    createdAt: new Date().toISOString(),
  })
  return docRef.id
}

export async function getNotificationsForUser(userId: string): Promise<Notification[]> {
  const q = query(
    notifCol,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as Notification)
}

export async function markAsRead(notificationId: string): Promise<void> {
  await updateDoc(doc(db, FIRESTORE_COLLECTIONS.NOTIFICATIONS, notificationId), { read: true })
}

export async function markAllAsRead(userId: string): Promise<void> {
  const q = query(notifCol, where('userId', '==', userId), where('read', '==', false))
  const snapshot = await getDocs(q)
  const batch = writeBatch(db)
  snapshot.docs.forEach(d => batch.update(d.ref, { read: true }))
  await batch.commit()
}

export function subscribeToNotifications(
  userId: string,
  callback: (notifications: Notification[]) => void
): () => void {
  const q = query(
    notifCol,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  )
  return onSnapshot(q, snapshot => {
    const notifications = snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as Notification)
    callback(notifications)
  })
}
