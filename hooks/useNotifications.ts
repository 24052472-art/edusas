'use client';

import { useState, useEffect } from 'react';
import { Notification } from '@/types';
import { subscribeToNotifications, markAsRead, markAllAsRead } from '@/services/modules/notifications/notificationsService';

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToNotifications(userId, (notifs) => {
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => !n.read).length);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    await markAllAsRead(userId);
  };

  return { notifications, unreadCount, markAsRead: handleMarkAsRead, markAllAsRead: handleMarkAllAsRead };
}
