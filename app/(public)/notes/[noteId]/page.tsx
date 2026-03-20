'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Download, Bookmark, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getNoteById, incrementDownloads } from '@/services/modules/notesService'
import { saveNote, unsaveNote, recordDownload } from '@/services/modules/usersService'
import { Note } from '@/types/note'
import { PDFViewer } from '@/components/notes/PDFViewer'
import { RelatedNotes } from '@/components/notes/RelatedNotes'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuth } from '@/hooks/useAuth'
import { formatDate, formatNumber } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function NoteDetailPage() {
  const params = useParams()
  const noteId = params.noteId as string
  const { user, refreshUser } = useAuth()
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (noteId) {
      getNoteById(noteId).then(data => {
        setNote(data)
        setLoading(false)
      })
    }
  }, [noteId])

  useEffect(() => {
    if (user && note) {
      setSaved(user.savedNotes?.includes(note.id) || false)
    }
  }, [user, note])

  const handleSave = async () => {
    if (!user || !note) { toast.error('Please sign in'); return }
    if (saved) {
      await unsaveNote(user.uid, note.id)
      setSaved(false)
      toast.success('Removed from saved')
    } else {
      await saveNote(user.uid, note.id)
      setSaved(true)
      toast.success('Saved!')
    }
    await refreshUser()
  }

  const handleDownload = async () => {
    if (!user || !note) { toast.error('Please sign in to download'); return }
    await Promise.all([
      incrementDownloads(note.id),
      recordDownload(user.uid, note.id),
    ])
    window.open(note.fileUrl, '_blank')
    toast.success('Download started!')
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
          <div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Note not found</h2>
        <p className="text-gray-500 mb-6">This note may have been removed or is not available.</p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Notes
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="primary">{note.category}</Badge>
              <Badge variant="default">{note.branchName}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{note.title}</h1>
            <p className="text-gray-600">{note.description}</p>
          </div>

          <PDFViewer
            fileUrl={note.fileUrl}
            noteId={note.id}
            noteTitle={note.title}
            onDownload={handleDownload}
          />

          <RelatedNotes branchId={note.branchId} currentNoteId={note.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Metadata */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Details</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500 mb-0.5">Subject</dt>
                <dd className="font-medium text-gray-900">{note.subjectName}</dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-0.5">Topic</dt>
                <dd className="font-medium text-gray-900">{note.topic}</dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-0.5">Category</dt>
                <dd className="font-medium text-gray-900 capitalize">{note.category}</dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-0.5">Uploaded</dt>
                <dd className="font-medium text-gray-900">{formatDate(note.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-0.5">Downloads</dt>
                <dd className="font-medium text-gray-900">{formatNumber(note.downloads)}</dd>
              </div>
            </dl>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
            <Button onClick={handleDownload} className="w-full" icon={<Download size={16} />}>
              Download PDF
            </Button>
            <Button
              variant={saved ? 'secondary' : 'outline'}
              onClick={handleSave}
              className="w-full"
              icon={<Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />}
            >
              {saved ? 'Saved' : 'Save Note'}
            </Button>
          </div>

          {/* Uploader */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Uploaded by</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold">
                {note.uploaderName[0]}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{note.uploaderName}</p>
                <p className="text-xs text-gray-500 capitalize">{note.uploaderRole}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
