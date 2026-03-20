'use client'
import { motion } from 'framer-motion'
import { Users, BookOpen, ShieldCheck, TrendingUp, AlertCircle } from 'lucide-react'
import { usePlatformStats } from '@/hooks/useAnalytics'
import { useNotesFetch } from '@/hooks/useNotes'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { NoteCardSkeleton } from '@/components/ui/Skeleton'
import { formatNumber, formatRelativeTime } from '@/lib/utils'
import { approveNote, rejectNote } from '@/services/modules/notesService'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function AdminDashboard() {
  const { stats, loading: statsLoading } = usePlatformStats()
  const { notes: pendingNotes, loading: pendingLoading, refetch } = useNotesFetch({ status: 'pending' })

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: <Users size={20} className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Teachers', value: stats?.totalTeachers || 0, icon: <BookOpen size={20} className="text-green-600" />, bg: 'bg-green-50' },
    { label: 'Approved Notes', value: stats?.totalNotes || 0, icon: <TrendingUp size={20} className="text-primary-600" />, bg: 'bg-primary-50' },
    { label: 'Pending Review', value: stats?.pendingNotes || 0, icon: <AlertCircle size={20} className="text-orange-600" />, bg: 'bg-orange-50' },
  ]

  const handleApprove = async (noteId: string) => {
    await approveNote(noteId)
    toast.success('Note approved!')
    refetch()
  }

  const handleReject = async (noteId: string) => {
    await rejectNote(noteId)
    toast.success('Note rejected')
    refetch()
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Platform overview and management</p>
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

      {/* Pending Moderation */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Pending Moderation</h2>
            <p className="text-sm text-gray-500">Notes awaiting review</p>
          </div>
          <Link href="/admin/moderation">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>

        {pendingLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => <NoteCardSkeleton key={i} />)}
          </div>
        ) : pendingNotes.length === 0 ? (
          <Card className="p-8 text-center">
            <ShieldCheck size={32} className="mx-auto text-green-400 mb-2" />
            <p className="text-gray-500">No pending notes</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingNotes.slice(0, 5).map(note => (
              <Card key={note.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{note.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {note.branchName} · {note.subjectName} · by {note.uploaderName}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(note.createdAt)}</p>
                </div>
                <Badge variant="warning">Pending</Badge>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => handleApprove(note.id)}>Approve</Button>
                  <Button size="sm" variant="danger" onClick={() => handleReject(note.id)}>Reject</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
