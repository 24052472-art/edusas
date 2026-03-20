'use client';

import { useState, useEffect } from 'react';
import { Note, NoteCategory } from '@/types';
import { subscribeToApprovedNotes, getApprovedNotes } from '@/services/modules/notes/notesService';

export function useNotes(filters?: { branchId?: string; category?: NoteCategory }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToApprovedNotes((updatedNotes) => {
      setNotes(updatedNotes);
      setLoading(false);
    }, filters);

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.branchId, filters?.category]);

  return { notes, loading, error };
}

export function usePaginatedNotes(filters?: { branchId?: string; category?: NoteCategory }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const result = await getApprovedNotes({ ...filters, lastDoc });
    setNotes((prev) => [...prev, ...result.notes]);
    setLastDoc(result.lastDoc);
    setHasMore(result.notes.length > 0);
    setLoading(false);
  };

  useEffect(() => {
    setNotes([]);
    setLastDoc(null);
    setHasMore(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.branchId, filters?.category]);

  return { notes, loading, hasMore, loadMore };
}
