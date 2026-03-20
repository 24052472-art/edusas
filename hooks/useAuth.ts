'use client'
import { useState, useEffect, useContext } from 'react'
import { User as FirebaseUser } from 'firebase/auth'
import { onAuthChange, getUserProfile, signOutUser } from '@/services/core/authService'
import { User } from '@/types/user'
import { createContext } from 'react'

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function useAuthProvider(): AuthContextType {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    if (firebaseUser) {
      const profile = await getUserProfile(firebaseUser.uid)
      setUser(profile)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthChange(async fbUser => {
      setFirebaseUser(fbUser)
      if (fbUser) {
        const profile = await getUserProfile(fbUser.uid)
        setUser(profile)
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signOut = async () => {
    await signOutUser()
    setUser(null)
    setFirebaseUser(null)
  }

  return { user, firebaseUser, loading, signOut, refreshUser }
}
