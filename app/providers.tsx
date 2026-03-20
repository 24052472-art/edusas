'use client'
import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthContext, useAuthProvider } from '@/hooks/useAuth'

export function Providers({ children }: { children: ReactNode }) {
  const auth = useAuthProvider()

  return (
    <AuthContext.Provider value={auth}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#fff',
            color: '#111827',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      />
    </AuthContext.Provider>
  )
}
