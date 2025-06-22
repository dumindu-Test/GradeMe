import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '@/lib/supabase'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

export async function POST(request: NextRequest) {
  console.log('Signin API called')
  
  try {
    const { email, password } = await request.json()
    
    console.log('Signin attempt for:', email)
    
    // Validation
    if (!email || !password) {
      console.log('Validation failed: missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Find user by email
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single()
    
    if (findError || !user) {
      console.log('User not found or error:', findError)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    console.log('User found:', user.email)
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    console.log('Password verified successfully')
    
    // Update last login
    const { error: updateError } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id)
    
    if (updateError) {
      console.error('Failed to update last login:', updateError)
      // Don't fail the login if this fails
    }
    
    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        userType: user.user_type
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
    
    console.log('JWT token created for user:', user.email)
    
    // Return user data and token (without password hash)
    const userResponse = {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      full_name: user.full_name,
      created_at: user.created_at,
      last_login: user.last_login
    }
    
    console.log('Signin successful for:', email)
    
    // Set HTTP-only cookie for token
    const response = NextResponse.json({ user: userResponse }, { status: 200 })
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    })
    
    return response
    
  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}