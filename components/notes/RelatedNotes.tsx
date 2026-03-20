'use client'
import { useNotesFetch } from '@/hooks/useNotes'
import { NoteCard } from './NoteCard'
import { NoteCardSkeleton } from '@/components/ui/Skeleton'

interface RelatedNotesProps {
  branchId: string
  currentNoteId: string
}

export function RelatedNotes({ branchId, currentNoteId }: RelatedNotesProps) {
  const { notes, loading } = useNotesFetch({ branchId, status: 'approved' })
  const related = notes.filter(n => n.id !== currentNoteId).slice(0, 4)

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4">Related Notes</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <NoteCardSkeleton key={i} />)
          : related.map(note => <NoteCard key={note.id} note={note} />)
        }
        {!loading && related.length === 0 && (
          <p className="text-sm text-gray-400 col-span-2">No related notes found.</p>
        )}
      </div>
    </div>
  )
}
