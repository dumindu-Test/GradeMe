'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { UserProfile } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  console.log('AuthProvider initialized')

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, skipping auth setup')
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    console.log('Fetching profile for user:', userId)
    
    if (!isSupabaseConfigured()) {
      // Demo mode - create mock profile
      const demoProfile: UserProfile = {
        id: userId,
        email: userId === 'demo-admin' ? 'admin@grademe.com' : 'student@university.edu',
        user_type: userId === 'demo-admin' ? 'admin' : 'student',
        full_name: userId === 'demo-admin' ? 'Demo Admin' : 'Demo Student',
        created_at: new Date().toISOString()
      }
      setProfile(demoProfile)
      return
    }
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        // If profile doesn't exist, create one from user metadata
        if (error.code === 'PGRST116') {
          await createUserProfile(userId)
          return
        }
      } else {
        console.log('User profile fetched:', data)
        setProfile(data)
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error)
    }
  }

  const createUserProfile = async (userId: string) => {
    console.log('Creating user profile for:', userId)
    
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      const userType = userData.user.user_metadata?.user_type || 'student'
      
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: userId,
            email: userData.user.email!,
            user_type: userType,
            full_name: userData.user.user_metadata?.full_name || '',
            created_at: new Date().toISOString(),
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Error creating user profile:', error)
      } else {
        console.log('User profile created:', data)
        setProfile(data)
      }
    } catch (error) {
      console.error('Unexpected error creating profile:', error)
    }
  }

  const handleSignOut = async () => {
    console.log('Signing out user')
    
    if (!isSupabaseConfigured()) {
      // Demo mode - just clear state
      setUser(null)
      setProfile(null)
      return
    }
    
    await supabase.auth.signOut()
  }

  const value = {
    user,
    profile,
    loading,
    signOut: handleSignOut,
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