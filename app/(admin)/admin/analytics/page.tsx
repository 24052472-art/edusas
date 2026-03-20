'use client'
import { motion } from 'framer-motion'
import { BarChart2, TrendingUp, Users, BookOpen, Download } from 'lucide-react'
import { usePlatformStats } from '@/hooks/useAnalytics'
import { Card } from '@/components/ui/Card'
import { formatNumber } from '@/lib/utils'

export default function AnalyticsPage() {
  const { stats, loading } = usePlatformStats()

  const metrics = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: <Users size={24} className="text-blue-500" />, change: '+12%', bg: 'bg-blue-50' },
    { label: 'Total Teachers', value: stats?.totalTeachers || 0, icon: <BookOpen size={24} className="text-green-500" />, change: '+5%', bg: 'bg-green-50' },
    { label: 'Approved Notes', value: stats?.totalNotes || 0, icon: <TrendingUp size={24} className="text-primary-500" />, change: '+18%', bg: 'bg-primary-50' },
    { label: 'Total Downloads', value: stats?.totalDownloads || 0, icon: <Download size={24} className="text-purple-500" />, change: '+25%', bg: 'bg-purple-50' },
  ]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Platform performance overview</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-5">
              <div className={`w-12 h-12 ${metric.bg} rounded-xl flex items-center justify-center mb-4`}>
                {metric.icon}
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : formatNumber(metric.value)}
              </p>
              <p className="text-sm text-gray-500 mt-1">{metric.label}</p>
              <p className="text-xs text-green-600 font-medium mt-2">{metric.change} this month</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Growth Overview</h3>
        <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
          <div className="text-center text-gray-400">
            <BarChart2 size={32} className="mx-auto mb-2" />
            <p className="text-sm">Analytics charts will render with real data</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
