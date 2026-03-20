'use client'
import { motion } from 'framer-motion'
import { ShieldCheck, CheckCircle, XCircle } from 'lucide-react'
import { useNotesFetch } from '@/hooks/useNotes'
import { approveNote, rejectNote } from '@/services/modules/notesService'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { NoteCardSkeleton } from '@/components/ui/Skeleton'
import { formatRelativeTime } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ModerationPage() {
  const { notes, loading, refetch } = useNotesFetch({ status: 'pending' })

  const handleApprove = async (noteId: string) => {
    await approveNote(noteId)
    toast.success('Note approved and published!')
    refetch()
  }

  const handleReject = async (noteId: string) => {
    await rejectNote(noteId)
    toast.success('Note rejected')
    refetch()
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Moderation Queue</h1>
        <p className="text-gray-500 text-sm mt-1">Review and approve teacher uploads</p>
      </motion.div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <NoteCardSkeleton key={i} />)}
        </div>
      ) : notes.length === 0 ? (
        <Card className="p-12 text-center">
          <ShieldCheck size={48} className="mx-auto text-green-400 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">All clear!</h3>
          <p className="text-gray-500 text-sm">No notes pending review</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <Badge variant="warning" size="md">{notes.length} pending</Badge>
          {notes.map(note => (
            <Card key={note.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="primary">{note.category}</Badge>
                    <Badge variant="default">{note.branchName}</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900">{note.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{note.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    <span>by {note.uploaderName}</span>
                    <span>·</span>
                    <span>{note.subjectName}</span>
                    <span>·</span>
                    <span>{formatRelativeTime(note.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleApprove(note.id)}
                    icon={<CheckCircle size={14} />}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleReject(note.id)}
                    icon={<XCircle size={14} />}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
