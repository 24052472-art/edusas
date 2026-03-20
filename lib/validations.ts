import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const noteUploadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description too long'),
  branchId: z.string().min(1, 'Branch is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  topic: z.string().min(2, 'Topic is required').max(50, 'Topic too long'),
  category: z.enum(['notes', 'pyq', 'entrance']),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags'),
})

export const branchSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  code: z.string().min(2, 'Code is required').max(10, 'Code too long'),
  description: z.string().max(200, 'Description too long').optional(),
})

export const subjectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  code: z.string().min(2, 'Code is required').max(10, 'Code too long'),
  branchId: z.string().min(1, 'Branch is required'),
})

export const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  bio: z.string().max(300, 'Bio too long').optional(),
  qualification: z.string().max(100, 'Qualification too long').optional(),
})

export type NoteUploadInput = z.infer<typeof noteUploadSchema>
export type BranchInput = z.infer<typeof branchSchema>
export type SubjectInput = z.infer<typeof subjectSchema>
export type ProfileInput = z.infer<typeof profileSchema>
