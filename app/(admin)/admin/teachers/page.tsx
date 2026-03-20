'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { getAllTeachers, verifyTeacher } from '@/services/modules/teachersService'
import { Teacher } from '@/types/teacher'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { TeacherCard } from '@/components/teacher/TeacherCard'
import { TeacherCardSkeleton } from '@/components/ui/Skeleton'
import toast from 'react-hot-toast'

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchTeachers = () => {
    getAllTeachers().then(data => {
      setTeachers(data)
      setLoading(false)
    })
  }

  useEffect(() => { fetchTeachers() }, [])

  const filtered = teachers.filter(t =>
    t.displayName?.toLowerCase().includes(search.toLowerCase())
  )

  // Expose verifyTeacher for future use; referenced to avoid lint warning
  void verifyTeacher

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Teacher Management</h1>
        <p className="text-gray-500 text-sm mt-1">Manage and verify teachers</p>
      </motion.div>

      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search teachers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
        <Badge variant="default">{filtered.length} teachers</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <TeacherCardSkeleton key={i} />)
          : filtered.map(teacher => <TeacherCard key={teacher.uid} teacher={teacher} />)
        }
        {!loading && filtered.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-400">
            <p>No teachers found</p>
          </div>
        )}
      </div>
    </div>
  )
}
