'use client'
import { useState, useEffect } from 'react'
import { subscribeToTeachers } from '@/services/modules/teachersService'
import { Teacher } from '@/types/teacher'

export function useTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToTeachers((data) => {
      setTeachers(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return { teachers, loading, error }
}
