'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { GraduationCap, BookOpen } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createUserProfile } from '@/services/core/authService'
import { Button } from '@/components/ui/Button'
import { UserRole } from '@/types/common'
import toast from 'react-hot-toast'

const roles: { id: UserRole; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'student',
    label: 'Student',
    description: 'Access notes, follow teachers, track your progress',
    icon: <GraduationCap size={28} />,
  },
  {
    id: 'teacher',
    label: 'Teacher',
    description: 'Upload notes, build followers, share knowledge',
    icon: <BookOpen size={28} />,
  },
]

export default function OnboardingPage() {
  const { firebaseUser, refreshUser } = useAuth()
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<UserRole>('student')
  const [loading, setLoading] = useState(false)

  const handleContinue = async () => {
    if (!firebaseUser) return
    setLoading(true)
    try {
      await createUserProfile(firebaseUser, selectedRole)
      await refreshUser()
      if (selectedRole === 'teacher') {
        router.push('/teacher/dashboard')
      } else {
        router.push('/student/dashboard')
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Setup failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-beige-50 to-beige-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">How will you use EduHub?</h1>
          <p className="text-gray-500 text-sm mt-2">Choose your role to get started</p>
        </div>

        <div className="space-y-3 mb-8">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                selectedRole === role.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${selectedRole === role.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'}`}>
                {role.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{role.label}</p>
                <p className="text-sm text-gray-500">{role.description}</p>
              </div>
            </button>
          ))}
        </div>

        <Button size="lg" className="w-full" loading={loading} onClick={handleContinue}>
          Get Started as {roles.find(r => r.id === selectedRole)?.label}
        </Button>
      </motion.div>
    </div>
  )
}
