export interface Teacher {
  uid: string
  displayName: string
  email: string
  photoURL: string | null
  bio: string
  qualification: string
  subjects: string[]
  branches: string[]
  verified: boolean
  followers: number
  following: number
  totalUploads: number
  totalDownloads: number
  totalViews: number
  joinedAt: string
  updatedAt: string
  socialLinks?: {
    youtube?: string
    linkedin?: string
    website?: string
  }
}

export interface TeacherPost {
  id: string
  teacherId: string
  content: string
  type: 'text' | 'announcement' | 'video'
  videoUrl?: string
  createdAt: string
  likes: number
  comments: number
}
