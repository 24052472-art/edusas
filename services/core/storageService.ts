import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { storage } from './firebase'
import { STORAGE_PATHS } from '@/lib/constants'

export interface UploadProgress {
  progress: number
  downloadURL?: string
  error?: string
}

export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        onProgress?.(progress)
      },
      error => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(downloadURL)
      }
    )
  })
}

export async function uploadNoteFile(
  file: File,
  noteId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const path = `${STORAGE_PATHS.NOTES}/${noteId}/${file.name}`
  return uploadFile(file, path, onProgress)
}

export async function uploadAvatar(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const path = `${STORAGE_PATHS.AVATARS}/${userId}/avatar`
  return uploadFile(file, path, onProgress)
}

export async function deleteFile(fileUrl: string): Promise<void> {
  const fileRef = ref(storage, fileUrl)
  await deleteObject(fileRef)
}
