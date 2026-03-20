'use client'
import { motion } from 'framer-motion'
import { BookOpen, Download, Users, TrendingUp, Upload } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useTeacherAnalytics } from '@/hooks/useAnalytics'
import { useNotesFetch } from '@/hooks/useNotes'
import { NoteCard } from '@/components/notes/NoteCard'
import { NoteCardSkeleton } from '@/components/ui/Skeleton'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatNumber } from '@/lib/utils'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const { stats, loading: statsLoading } = useTeacherAnalytics(user?.uid)
  const { notes, loading: notesLoading } = useNotesFetch({ status: 'approved' })

  const myNotes = user ? notes.filter(n => n.uploadedBy === user.uid) : []

  if (!user) return null

  const statCards = [
    { label: 'Total Uploads', value: stats?.totalUploads || 0, icon: <Upload size={20} className="text-primary-600" />, bg: 'bg-primary-50' },
    { label: 'Downloads', value: stats?.totalDownloads || 0, icon: <Download size={20} className="text-secondary-600" />, bg: 'bg-secondary-50' },
    { label: 'Followers', value: 0, icon: <Users size={20} className="text-purple-600" />, bg: 'bg-purple-50' },
    { label: 'Pending', value: stats?.pendingNotes || 0, icon: <TrendingUp size={20} className="text-orange-600" />, bg: 'bg-orange-50' },
  ]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your content and followers</p>
          </div>
          <Link href="/teacher/upload">
            <Button icon={<Upload size={16} />}>Upload Notes</Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-4">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : formatNumber(stat.value)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">My Notes</h2>
          <Badge variant="default">{myNotes.length} total</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {notesLoading
            ? Array.from({ length: 3 }).map((_, i) => <NoteCardSkeleton key={i} />)
            : myNotes.slice(0, 6).map(note => <NoteCard key={note.id} note={note} />)
          }
          {!notesLoading && myNotes.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-400">
              <BookOpen size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No notes uploaded yet</p>
              <p className="text-sm mt-1">Start by uploading your first note</p>
              <Link href="/teacher/upload" className="mt-4 inline-block">
                <Button size="sm" icon={<Upload size={14} />}>Upload Now</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
