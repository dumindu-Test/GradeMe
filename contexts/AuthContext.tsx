'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { CustomUser, getCurrentUserCustom, signOutCustom } from '@/lib/custom-auth'

interface AuthContextType {
  user: CustomUser | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null)
  const [loading, setLoading] = useState(true)

  console.log('AuthProvider initialized with custom auth')

  const refreshUser = async () => {
    console.log('Refreshing user data...')
    try {
      const currentUser = await getCurrentUserCustom()
      setUser(currentUser)
      console.log('User refreshed:', currentUser?.email || 'none')
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('Initializing custom auth...')
      setLoading(true)
      
      try {
        const currentUser = await getCurrentUserCustom()
        setUser(currentUser)
        console.log('Initial user loaded:', currentUser?.email || 'none')
      } catch (error) {
        console.error('Error loading initial user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const handleSignOut = async () => {
    console.log('Signing out user')
    
    try {
      await signOutCustom()
      setUser(null)
      console.log('User signed out successfully')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    loading,
    signOut: handleSignOut,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}