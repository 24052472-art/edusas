'use client'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'
import { useNotifications } from '@/hooks/useNotifications'
import { useAuth } from '@/hooks/useAuth'
import { Notification } from '@/types/notification'
import { cn } from '@/lib/utils'
import { BookOpen, AlertCircle, Settings } from 'lucide-react'

interface NotificationItemProps {
  notification: Notification
  onClose: () => void
}

const typeIcons = {
  follow_upload: <BookOpen size={16} />,
  branch_upload: <BookOpen size={16} />,
  system: <Settings size={16} />,
  moderation: <AlertCircle size={16} />,
}

const typeColors = {
  follow_upload: 'text-primary-600 bg-primary-50',
  branch_upload: 'text-secondary-600 bg-secondary-50',
  system: 'text-blue-600 bg-blue-50',
  moderation: 'text-orange-600 bg-orange-50',
}

export function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const { user } = useAuth()
  const { markRead } = useNotifications(user?.uid)

  const handleClick = () => {
    if (!notification.read) markRead(notification.id)
    onClose()
  }

  const content = (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50',
        !notification.read && 'bg-primary-50/30'
      )}
    >
      <div className={cn('p-2 rounded-lg flex-shrink-0', typeColors[notification.type])}>
        {typeIcons[notification.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(notification.createdAt)}</p>
      </div>
      {!notification.read && (
        <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1.5" />
      )}
    </div>
  )

  if (notification.actionUrl) {
    return <Link href={notification.actionUrl}>{content}</Link>
  }

  return content
}
