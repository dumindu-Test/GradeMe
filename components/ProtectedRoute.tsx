'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredUserType?: 'admin' | 'student'
}

export function ProtectedRoute({ children, requiredUserType }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  console.log('ProtectedRoute check:', { user: !!user, userType: user?.user_type, loading, requiredUserType })

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('No user found, redirecting to login')
        router.push('/')
        return
      }

      if (requiredUserType && user && user.user_type !== requiredUserType) {
        console.log('Wrong user type, redirecting:', user.user_type, 'required:', requiredUserType)
        // Redirect to appropriate dashboard
        if (user.user_type === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/student/dashboard')
        }
        return
      }
    }
  }, [user, loading, router, requiredUserType])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-96">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  if (requiredUserType && user && user.user_type !== requiredUserType) {
    return null // Will redirect to appropriate dashboard
  }

  return <>{children}</>
}