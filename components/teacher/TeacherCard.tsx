'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Users, BookOpen, CheckCircle } from 'lucide-react'
import { Teacher } from '@/types/teacher'
import { Badge } from '@/components/ui/Badge'
import { formatNumber, getInitials } from '@/lib/utils'
import { FollowButton } from './FollowButton'

interface TeacherCardProps {
  teacher: Teacher
}

export function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
    >
      <div className="flex items-start gap-4">
        {teacher.photoURL ? (
          <Image
            src={teacher.photoURL}
            alt={teacher.displayName}
            width={48}
            height={48}
            className="rounded-full flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
            {getInitials(teacher.displayName)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Link href={`/teacher/${teacher.uid}`}>
              <h3 className="font-semibold text-gray-900 text-sm hover:text-primary-600 transition-colors truncate">
                {teacher.displayName}
              </h3>
            </Link>
            {teacher.verified && (
              <CheckCircle size={14} className="text-blue-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{teacher.qualification}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Users size={12} />
              {formatNumber(teacher.followers)}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              {formatNumber(teacher.totalUploads)}
            </span>
          </div>
        </div>
      </div>

      {teacher.subjects.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {teacher.subjects.slice(0, 3).map(s => (
            <Badge key={s} variant="default" size="sm">{s}</Badge>
          ))}
          {teacher.subjects.length > 3 && (
            <Badge variant="default" size="sm">+{teacher.subjects.length - 3}</Badge>
          )}
        </div>
      )}

      <div className="mt-4">
        <FollowButton teacherId={teacher.uid} />
      </div>
    </motion.div>
  )
}
