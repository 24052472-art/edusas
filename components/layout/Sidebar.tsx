'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { BookOpen } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  badge?: number
}

interface SidebarProps {
  items: NavItem[]
  className?: string
}

export function Sidebar({ items, className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={cn('w-64 flex-shrink-0 h-screen sticky top-0 pt-4 pb-8 flex flex-col gap-1 px-3', className)}>
      <div className="flex items-center gap-2 px-3 py-3 mb-4">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <BookOpen size={18} className="text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900">EduHub</span>
      </div>

      <nav className="flex-1 space-y-0.5">
        {items.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative',
                  active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary-50 rounded-xl"
                    transition={{ type: 'spring', duration: 0.3 }}
                  />
                )}
                <span className={cn('relative z-10', active ? 'text-primary-600' : 'text-gray-500')}>
                  {item.icon}
                </span>
                <span className="relative z-10">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="relative z-10 ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
