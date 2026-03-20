export type UserRole = 'student' | 'teacher' | 'admin' | 'super_admin'
export type ContentCategory = 'notes' | 'pyq' | 'entrance'
export type ContentStatus = 'pending' | 'approved' | 'rejected'
export type NotificationType = 'follow_upload' | 'branch_upload' | 'system' | 'moderation'

export interface PaginationOptions {
  limit: number
  startAfter?: string
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  loading: boolean
}

export interface SelectOption {
  value: string
  label: string
}
