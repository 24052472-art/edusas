'use client'
import { useState, useEffect } from 'react'
import {
  doc,
  collection,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '@/services/core/firebase'

export function useDocument<T>(path: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ref = doc(db, path)
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        setData({ id: snapshot.id, ...snapshot.data() } as T)
      } else {
        setData(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [path])

  return { data, loading }
}

export function useCollection<T>(collectionPath: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ref = collection(db, collectionPath)
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as T)
      setData(docs)
      setLoading(false)
    })
    return unsubscribe
  }, [collectionPath])

  return { data, loading }
}
