export interface CustomUser {
  id: string
  email: string
  user_type: 'admin' | 'student'
  full_name?: string
  created_at: string
  last_login?: string
}

export interface AuthResult {
  success: boolean
  user?: CustomUser
  error?: string
}

// Sign up with email and password
export async function signUpWithEmailCustom(
  email: string, 
  password: string, 
  userType: 'admin' | 'student',
  fullName?: string
): Promise<AuthResult> {
  console.log('Custom signup attempt:', email, userType)
  
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        userType,
        fullName
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Signup failed:', data.error)
      return { success: false, error: data.error }
    }

    console.log('Signup successful:', data.user.email)
    return { success: true, user: data.user }
  } catch (error) {
    console.error('Signup error:', error)
    return { success: false, error: 'Network error occurred' }
  }
}

// Sign in with email and password
export async function signInWithEmailCustom(email: string, password: string): Promise<AuthResult> {
  console.log('Custom signin attempt:', email)
  
  try {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Signin failed:', data.error)
      return { success: false, error: data.error }
    }

    console.log('Signin successful:', data.user.email)
    return { success: true, user: data.user }
  } catch (error) {
    console.error('Signin error:', error)
    return { success: false, error: 'Network error occurred' }
  }
}

// Sign out
export async function signOutCustom(): Promise<{ success: boolean; error?: string }> {
  console.log('Custom signout attempt')
  
  try {
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
    })

    if (!response.ok) {
      console.error('Signout failed')
      return { success: false, error: 'Failed to sign out' }
    }

    console.log('Signout successful')
    return { success: true }
  } catch (error) {
    console.error('Signout error:', error)
    return { success: false, error: 'Network error occurred' }
  }
}

// Get current user
export async function getCurrentUserCustom(): Promise<CustomUser | null> {
  console.log('Getting current user...')
  
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Failed to get current user')
      return null
    }

    console.log('Current user retrieved:', data.user?.email || 'none')
    return data.user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}