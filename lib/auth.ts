import { supabase, isSupabaseConfigured } from './supabase'
import { User } from '@supabase/supabase-js'

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  console.log('Attempting sign in with email:', email)
  
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured, using demo mode')
    // Demo mode - simulate authentication
    const demoUsers = {
      'admin@grademe.com': { type: 'admin', password: 'admin123' },
      'student@university.edu': { type: 'student', password: 'student123' }
    }
    
    const demoUser = demoUsers[email as keyof typeof demoUsers]
    if (demoUser && demoUser.password === password) {
      return { 
        success: true, 
        user: { 
          id: `demo-${demoUser.type}`, 
          email,
          app_metadata: {},
          user_metadata: { user_type: demoUser.type },
          aud: 'authenticated',
          created_at: new Date().toISOString()
        } as User 
      }
    }
    
    return { success: false, error: 'Invalid demo credentials' }
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Supabase auth error:', error)
      return { success: false, error: error.message }
    }

    if (data.user) {
      console.log('Sign in successful:', data.user.email)
      return { success: true, user: data.user }
    }

    return { success: false, error: 'No user returned' }
  } catch (error) {
    console.error('Sign in error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function signUpWithEmail(email: string, password: string, userType: 'admin' | 'student'): Promise<AuthResult> {
  console.log('Attempting sign up with email:', email, 'type:', userType)
  
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured, sign up not available in demo mode')
    return { 
      success: false, 
      error: 'Sign up is not available in demo mode. Please configure Supabase to enable account creation.' 
    }
  }
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType
        }
      }
    })

    if (error) {
      console.error('Supabase signup error:', error)
      return { success: false, error: error.message }
    }

    if (data.user) {
      console.log('Sign up successful:', data.user.email)
      return { success: true, user: data.user }
    }

    return { success: false, error: 'No user returned' }
  } catch (error) {
    console.error('Sign up error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function signOut(): Promise<void> {
  console.log('Signing out user')
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Sign out error:', error)
  }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId: string) {
  console.log('Fetching user profile for:', userId)
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}