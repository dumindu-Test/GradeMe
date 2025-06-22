import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  console.log('Signup API called')
  
  try {
    const { email, password, userType, fullName } = await request.json()
    
    console.log('Signup attempt:', { email, userType, fullName })
    
    // Validation
    if (!email || !password || !userType) {
      console.log('Validation failed: missing required fields')
      return NextResponse.json(
        { error: 'Email, password, and user type are required' },
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      console.log('Validation failed: password too short')
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }
    
    if (!['admin', 'student'].includes(userType)) {
      console.log('Validation failed: invalid user type')
      return NextResponse.json(
        { error: 'User type must be either admin or student' },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()
    
    if (existingUser) {
      console.log('User already exists:', email)
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }
    
    // Hash password
    console.log('Hashing password...')
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)
    console.log('Password hashed successfully')
    
    // Create user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([
        {
          email: email.toLowerCase(),
          password_hash: passwordHash,
          user_type: userType,
          full_name: fullName || '',
          is_active: true
        }
      ])
      .select()
      .single()
    
    if (createError) {
      console.error('Error creating user:', createError)
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }
    
    console.log('User created successfully:', newUser.id)
    
    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([
        {
          id: newUser.id,
          email: newUser.email,
          user_type: newUser.user_type,
          full_name: newUser.full_name
        }
      ])
    
    if (profileError) {
      console.error('Error creating user profile:', profileError)
      // Don't fail the signup if profile creation fails
    }
    
    // Return user data (without password hash)
    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      user_type: newUser.user_type,
      full_name: newUser.full_name,
      created_at: newUser.created_at
    }
    
    console.log('Signup successful for:', email)
    return NextResponse.json({ user: userResponse }, { status: 201 })
    
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}