'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { CheckCircle, Users, BookOpen, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getTeacherById } from '@/services/modules/teachersService'
import { Teacher } from '@/types/teacher'
import { FollowButton } from '@/components/teacher/FollowButton'
import { Badge } from '@/components/ui/Badge'
import { Tabs } from '@/components/ui/Tabs'
import { useNotesFetch } from '@/hooks/useNotes'
import { NoteCard } from '@/components/notes/NoteCard'
import { NoteCardSkeleton } from '@/components/ui/Skeleton'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatNumber, getInitials } from '@/lib/utils'

export default function TeacherProfilePage() {
  const params = useParams()
  const teacherId = params.teacherId as string
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(true)
  const { notes, loading: notesLoading } = useNotesFetch({ status: 'approved' })
  const teacherNotes = notes.filter(n => n.uploadedBy === teacherId)

  useEffect(() => {
    if (teacherId) {
      getTeacherById(teacherId).then(data => {
        setTeacher(data)
        setLoading(false)
      })
    }
  }, [teacherId])

  const tabs = [
    { id: 'notes', label: 'Notes' },
    { id: 'about', label: 'About' },
  ]

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Skeleton className="h-32 w-full rounded-xl mb-4" />
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center py-16">
        <p className="text-gray-500">Teacher not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back
      </Link>

      {/* Profile header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start gap-5">
          {teacher.photoURL ? (
            <Image src={teacher.photoURL} alt={teacher.displayName} width={72} height={72} className="rounded-full" />
          ) : (
            <div
              className="bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
              style={{ width: 72, height: 72 }}
            >
              {getInitials(teacher.displayName)}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900">{teacher.displayName}</h1>
              {teacher.verified && <CheckCircle size={18} className="text-blue-500" />}
            </div>
            <p className="text-gray-500 text-sm">{teacher.qualification}</p>
            {teacher.bio && <p className="text-gray-600 text-sm mt-2">{teacher.bio}</p>}
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Users size={14} /> {formatNumber(teacher.followers || 0)} followers
              </span>
              <span className="flex items-center gap-1">
                <BookOpen size={14} /> {formatNumber(teacher.totalUploads || 0)} notes
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {teacher.subjects?.map(s => <Badge key={s} variant="default" size="sm">{s}</Badge>)}
            </div>
          </div>
          <FollowButton teacherId={teacher.uid} />
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs}>
        {(activeTab: string) => (
          <div>
            {activeTab === 'notes' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {notesLoading
                  ? Array.from({ length: 6 }).map((_, i) => <NoteCardSkeleton key={i} />)
                  : teacherNotes.map(note => <NoteCard key={note.id} note={note} />)
                }
                {!notesLoading && teacherNotes.length === 0 && (
                  <p className="col-span-3 text-center text-gray-400 py-8">No notes uploaded yet</p>
                )}
              </div>
            )}
            {activeTab === 'about' && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">About</h3>
                <p className="text-gray-600 text-sm">{teacher.bio || 'No bio available'}</p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Qualification:</span>{' '}
                    <span className="text-gray-600">{teacher.qualification}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Subjects:</span>{' '}
                    <span className="text-gray-600">{teacher.subjects?.join(', ')}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Tabs>
    </div>
  )
}
