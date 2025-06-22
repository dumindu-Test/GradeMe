import { NextResponse } from 'next/server'

export async function POST() {
  console.log('Signout API called')
  
  const response = NextResponse.json({ message: 'Signed out successfully' })
  
  // Clear the auth token cookie
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0 // Expire immediately
  })
  
  console.log('User signed out successfully')
  return response
}