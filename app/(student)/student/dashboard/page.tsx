'use client'
import { motion } from 'framer-motion'
import { Bookmark, Download, TrendingUp, Star } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useNotesFetch } from '@/hooks/useNotes'
import { NoteCard } from '@/components/notes/NoteCard'
import { NoteCardSkeleton } from '@/components/ui/Skeleton'
import { Card } from '@/components/ui/Card'
import { Clock } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

export default function StudentDashboard() {
  const { user } = useAuth()
  const { notes: recentNotes, loading } = useNotesFetch({ status: 'approved' })

  if (!user) return null

  const stats = [
    { label: 'Saved Notes', value: user.savedNotes?.length || 0, icon: <Bookmark size={20} className="text-primary-600" />, bg: 'bg-primary-50' },
    { label: 'Downloads', value: user.stats?.totalDownloads || 0, icon: <Download size={20} className="text-secondary-600" />, bg: 'bg-secondary-50' },
    { label: 'Study Streak', value: `${user.stats?.studyStreak || 0}d`, icon: <TrendingUp size={20} className="text-orange-600" />, bg: 'bg-orange-50' },
    { label: 'Following', value: user.followingTeachers?.length || 0, icon: <Star size={20} className="text-yellow-600" />, bg: 'bg-yellow-50' },
  ]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.displayName.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">Continue your learning journey</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
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
                {typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Latest Notes</h2>
          <Clock size={16} className="text-gray-400" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <NoteCardSkeleton key={i} />)
            : recentNotes.slice(0, 6).map(note => (
              <NoteCard
                key={note.id}
                note={note}
                saved={user.savedNotes?.includes(note.id) || false}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}
