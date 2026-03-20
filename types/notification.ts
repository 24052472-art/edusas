import { NotificationType } from './common'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  actionUrl?: string
  metadata?: {
    noteId?: string
    teacherId?: string
    branchId?: string
  }
  createdAt: string
}
