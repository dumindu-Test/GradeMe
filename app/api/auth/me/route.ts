import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { supabase } from '@/lib/supabase'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

export async function GET(request: NextRequest) {
  console.log('Get current user API called')
  
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      console.log('No auth token found')
      return NextResponse.json({ user: null }, { status: 200 })
    }
    
    // Verify token
    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
      console.log('Token verified for user:', decoded.email)
    } catch (jwtError) {
      console.log('Invalid or expired token')
      return NextResponse.json({ user: null }, { status: 200 })
    }
    
    // Get fresh user data from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, user_type, full_name, created_at, last_login')
      .eq('id', decoded.userId)
      .eq('is_active', true)
      .single()
    
    if (userError || !user) {
      console.log('User not found or error:', userError)
      return NextResponse.json({ user: null }, { status: 200 })
    }
    
    console.log('Current user retrieved:', user.email)
    return NextResponse.json({ user }, { status: 200 })
    
  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}