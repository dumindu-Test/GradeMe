import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock client for development when env vars aren't set
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not found. Using mock client for development.')
    // Return a mock client that won't break the app
    return createClient('https://mock.supabase.co', 'mock-key', {
      auth: {
        persistSession: false,
        detectSessionInUrl: false
      }
    })
  }
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()

export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'https://mock.supabase.co')
}

export type UserProfile = {
  id: string
  email: string
  user_type: 'admin' | 'student'
  full_name?: string
  created_at: string
}