'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, BookOpen, Users, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function SearchHero() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/?search=${encodeURIComponent(query)}`)
  }

  const stats = [
    { icon: <BookOpen size={16} />, label: 'Notes Available', value: '10,000+' },
    { icon: <Users size={16} />, label: 'Active Teachers', value: '500+' },
    { icon: <TrendingUp size={16} />, label: 'Downloads', value: '50K+' },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-beige-100 via-beige-50 to-white py-20 px-4">
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-secondary-100 rounded-full blur-3xl opacity-40" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Your Academic{' '}
            <span className="gradient-text">Knowledge Hub</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Discover notes, connect with expert teachers, and excel in your studies.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSearch}
          className="flex gap-3 max-w-2xl mx-auto mb-12"
        >
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search notes, subjects, teachers..."
              className="w-full pl-12 pr-4 py-3.5 text-base bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
          <Button type="submit" size="lg">
            Search
          </Button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-3 gap-6 max-w-lg mx-auto"
        >
          {stats.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-primary-600 mb-1">
                {stat.icon}
                <span className="text-xl font-bold">{stat.value}</span>
              </div>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
