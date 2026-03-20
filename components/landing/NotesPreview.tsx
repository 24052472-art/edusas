'use client'
import { useNotesFetch } from '@/hooks/useNotes'
import { NoteCard } from '@/components/notes/NoteCard'
import { NoteCardSkeleton } from '@/components/ui/Skeleton'
import { useAuth } from '@/hooks/useAuth'
import { saveNote, unsaveNote, recordDownload } from '@/services/modules/usersService'
import { incrementDownloads } from '@/services/modules/notesService'
import toast from 'react-hot-toast'

export function NotesPreview() {
  const { user, refreshUser } = useAuth()
  const { notes, loading } = useNotesFetch({ status: 'approved' })

  const handleSave = async (noteId: string) => {
    if (!user) { toast.error('Please sign in'); return }
    const isSaved = user.savedNotes?.includes(noteId)
    if (isSaved) {
      await unsaveNote(user.uid, noteId)
      toast.success('Removed from saved')
    } else {
      await saveNote(user.uid, noteId)
      toast.success('Saved!')
    }
    await refreshUser()
  }

  const handleDownload = async (noteId: string) => {
    if (!user) { toast.error('Please sign in to download'); return }
    await Promise.all([
      incrementDownloads(noteId),
      recordDownload(user.uid, noteId),
    ])
    toast.success('Download started!')
  }

  return (
    <section className="py-12 px-4 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Latest Notes</h2>
            <p className="text-gray-500 text-sm mt-1">Recently uploaded by teachers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <NoteCardSkeleton key={i} />)
            : notes.slice(0, 8).map(note => (
              <NoteCard
                key={note.id}
                note={note}
                saved={user?.savedNotes?.includes(note.id) || false}
                onSave={handleSave}
                onDownload={handleDownload}
              />
            ))
          }
        </div>

        {!loading && notes.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-2">No notes available yet</p>
            <p className="text-sm">Be the first to upload!</p>
          </div>
        )}
      </div>
    </section>
  )
}
