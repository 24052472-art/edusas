'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Download, Bookmark, Eye, Star } from 'lucide-react'
import { Note } from '@/types/note'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatNumber, formatRelativeTime } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

interface NoteCardProps {
  note: Note
  onSave?: (noteId: string) => void
  onDownload?: (noteId: string) => void
  saved?: boolean
}

const categoryColors = {
  notes: 'primary',
  pyq: 'secondary',
  entrance: 'warning',
} as const

const categoryLabels = {
  notes: 'Notes',
  pyq: 'PYQ',
  entrance: 'Entrance',
}

export function NoteCard({ note, onSave, onDownload, saved = false }: NoteCardProps) {
  const { user } = useAuth()

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
      className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-primary-400 to-secondary-400" />

      <div className="p-5">
        {/* Category & Branch */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={categoryColors[note.category]} size="sm">
            {categoryLabels[note.category]}
          </Badge>
          <span className="text-xs text-gray-400">{note.branchName}</span>
        </div>

        {/* Title */}
        <Link href={`/notes/${note.id}`}>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1.5 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {note.title}
          </h3>
        </Link>

        {/* Subject & Topic */}
        <p className="text-xs text-gray-500 mb-3">
          {note.subjectName} · {note.topic}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <Download size={12} />
            {formatNumber(note.downloads)}
          </span>
          <span className="flex items-center gap-1">
            <Star size={12} />
            {note.rating.toFixed(1)}
          </span>
          <span className="ml-auto">{formatRelativeTime(note.createdAt)}</span>
        </div>

        {/* Uploader */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-semibold">
            {note.uploaderName[0]}
          </div>
          <span className="text-xs text-gray-500">{note.uploaderName}</span>
          {note.uploaderRole !== 'teacher' && (
            <Badge variant="info" size="sm">Admin</Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/notes/${note.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full" icon={<Eye size={14} />}>
              View
            </Button>
          </Link>
          <button
            onClick={() => {
              if (!user) return
              onSave?.(note.id)
            }}
            className={cn(
              'p-2 rounded-xl border transition-colors',
              saved
                ? 'bg-primary-50 border-primary-200 text-primary-600'
                : 'border-gray-200 text-gray-400 hover:border-primary-200 hover:text-primary-500'
            )}
          >
            <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
