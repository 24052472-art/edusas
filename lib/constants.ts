export const APP_NAME = 'EduHub'
export const APP_DESCRIPTION = 'Academic Knowledge Platform'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const

export const CONTENT_CATEGORIES = [
  { value: 'notes', label: 'Notes' },
  { value: 'pyq', label: 'Previous Year Questions' },
  { value: 'entrance', label: 'Entrance Exam' },
] as const

export const CONTENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const

export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  NOTES: 'notes',
  TEACHERS: 'teachers',
  BRANCHES: 'branches',
  SUBJECTS: 'subjects',
  NOTIFICATIONS: 'notifications',
  POSTS: 'posts',
  ANALYTICS: 'analytics',
} as const

export const STORAGE_PATHS = {
  NOTES: 'notes',
  AVATARS: 'avatars',
  THUMBNAILS: 'thumbnails',
} as const

export const PAGINATION_LIMIT = 20

export const NOTIFICATION_TYPES = {
  FOLLOW_UPLOAD: 'follow_upload',
  BRANCH_UPLOAD: 'branch_upload',
  SYSTEM: 'system',
  MODERATION: 'moderation',
} as const
