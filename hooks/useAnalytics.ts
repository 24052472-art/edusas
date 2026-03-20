'use client'
import { useState, useEffect } from 'react'
import { getPlatformStats, getTeacherStats, PlatformStats } from '@/services/modules/analyticsService'

export function usePlatformStats() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPlatformStats().then(data => {
      setStats(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return { stats, loading }
}

export function useTeacherAnalytics(teacherId: string | undefined) {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getTeacherStats>> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!teacherId) return
    getTeacherStats(teacherId).then(data => {
      setStats(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [teacherId])

  return { stats, loading }
}
