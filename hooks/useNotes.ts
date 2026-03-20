'use client'
import { useState, useEffect, useCallback } from 'react'
import { getNotes, subscribeToNotes } from '@/services/modules/notesService'
import { Note, NoteFilter } from '@/types/note'

export function useNotes(filters: NoteFilter = {}) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeToNotes(filters, (data) => {
      setNotes(data)
      setLoading(false)
    })
    return unsubscribe
  }, [filters.branchId, filters.subjectId, filters.category])

  return { notes, loading, error }
}

export function useNotesFetch(filters: NoteFilter = {}) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true)
      const { notes: data } = await getNotes(filters)
      setNotes(data)
      setHasMore(data.length === 20)
    } catch (e) {
      setError('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }, [filters.branchId, filters.subjectId, filters.category, filters.status])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  return { notes, loading, error, hasMore, refetch: fetchNotes }
}
