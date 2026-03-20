import { UserRole } from './common'

export interface User {
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  role: UserRole
  verified: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
  savedNotes: string[]
  followingTeachers: string[]
  enrolledBranches: string[]
  downloadHistory: string[]
  stats: UserStats
}

export interface UserStats {
  totalDownloads: number
  totalSaved: number
  studyStreak: number
  lastActive: string
}
