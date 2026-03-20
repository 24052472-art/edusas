'use client'
import { useTeachers } from '@/hooks/useTeachers'
import { TeacherCard } from '@/components/teacher/TeacherCard'
import { TeacherCardSkeleton } from '@/components/ui/Skeleton'

export function TeacherDirectory() {
  const { teachers, loading } = useTeachers()

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Expert Teachers</h2>
          <p className="text-gray-500 text-sm mt-1">Follow teachers in your field</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <TeacherCardSkeleton key={i} />)
            : teachers.slice(0, 8).map(teacher => (
              <TeacherCard key={teacher.uid} teacher={teacher} />
            ))
          }
        </div>

        {!loading && teachers.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p>No teachers available yet.</p>
          </div>
        )}
      </div>
    </section>
  )
}
