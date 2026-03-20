'use client'
import { useState, useEffect } from 'react'
import { subscribeToNotifications, markAsRead, markAllAsRead } from '@/services/modules/notificationsService'
import { Notification } from '@/types/notification'

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    const unsubscribe = subscribeToNotifications(userId, (data) => {
      setNotifications(data)
      setLoading(false)
    })
    return unsubscribe
  }, [userId])

  const markRead = async (id: string) => {
    await markAsRead(id)
  }

  const markAllRead = async () => {
    if (userId) await markAllAsRead(userId)
  }

  return { notifications, loading, unreadCount, markRead, markAllRead }
}
