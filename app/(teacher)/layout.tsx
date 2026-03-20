'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { Navbar } from '@/components/layout/Navbar'
import { LayoutDashboard, Upload, BookOpen, BarChart2, Users } from 'lucide-react'

const navItems = [
  { href: '/teacher/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/teacher/upload', label: 'Upload', icon: <Upload size={18} /> },
  { href: '/teacher/content', label: 'Content', icon: <BookOpen size={18} /> },
  { href: '/teacher/analytics', label: 'Analytics', icon: <BarChart2 size={18} /> },
  { href: '/teacher/followers', label: 'Followers', icon: <Users size={18} /> },
]

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'teacher' && user.role !== 'admin' && user.role !== 'super_admin'))) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      <div className="flex max-w-7xl mx-auto">
        <div className="hidden lg:block">
          <Sidebar items={navItems} />
        </div>
        <main className="flex-1 p-6 pb-24 lg:pb-6">{children}</main>
      </div>
      <div className="lg:hidden">
        <BottomNav items={navItems} />
      </div>
    </div>
  )
}
