import { createNote } from './notesService'
import { uploadNoteFile } from '../core/storageService'
import { Note } from '@/types/note'
import { User } from '@/types/user'
import { generateId } from '@/lib/utils'

export interface UploadNoteData {
  title: string
  description: string
  branchId: string
  branchName: string
  subjectId: string
  subjectName: string
  topic: string
  category: 'notes' | 'pyq' | 'entrance'
  tags: string[]
  file: File
}

export async function uploadNote(
  data: UploadNoteData,
  uploader: User,
  onProgress?: (progress: number) => void
): Promise<string> {
  const noteId = generateId()
  const isAutoApproved = uploader.role === 'admin' || uploader.role === 'super_admin'

  const fileUrl = await uploadNoteFile(data.file, noteId, onProgress)

  const noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> = {
    title: data.title,
    description: data.description,
    fileUrl,
    branchId: data.branchId,
    branchName: data.branchName,
    subjectId: data.subjectId,
    subjectName: data.subjectName,
    topic: data.topic,
    category: data.category,
    uploadedBy: uploader.uid,
    uploaderName: uploader.displayName,
    uploaderPhoto: uploader.photoURL || undefined,
    uploaderRole: uploader.role as 'teacher' | 'admin' | 'super_admin',
    status: isAutoApproved ? 'approved' : 'pending',
    downloads: 0,
    saves: 0,
    rating: 0,
    ratingCount: 0,
    tags: data.tags,
  }

  const id = await createNote(noteData)
  return id
}
