import { ContentCategory, ContentStatus } from './common'

export interface Note {
  id: string
  title: string
  description: string
  fileUrl: string
  thumbnailUrl?: string
  branchId: string
  branchName: string
  subjectId: string
  subjectName: string
  topic: string
  category: ContentCategory
  uploadedBy: string
  uploaderName: string
  uploaderPhoto?: string
  uploaderRole: 'teacher' | 'admin' | 'super_admin'
  status: ContentStatus
  downloads: number
  saves: number
  rating: number
  ratingCount: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface NoteFilter {
  branchId?: string
  subjectId?: string
  category?: ContentCategory
  status?: ContentStatus
  search?: string
}
