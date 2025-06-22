'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, GraduationCap, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithEmailCustom, signUpWithEmailCustom } from '@/lib/custom-auth';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();

  console.log('LoginPage rendered');

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      console.log('User already authenticated, redirecting:', user.user_type);
      if (user.user_type === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    }
  }, [user, loading, router]);

  const handleAuth = async (userType: 'admin' | 'student', email: string, password: string) => {
    console.log('Auth attempt:', { userType, email, isSignUp });
    setIsLoading(true);
    
    // Basic validation
    if (!email || !password) {
      setIsLoading(false);
      toast({
        title: "Validation Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = isSignUp 
        ? await signUpWithEmailCustom(email, password, userType, '')
        : await signInWithEmailCustom(email, password);

      if (result.success && result.user) {
        toast({
          title: isSignUp ? "Account Created" : "Login Successful",
          description: isSignUp 
            ? "Your account has been created successfully!"
            : `Welcome back, ${result.user.full_name || result.user.email}!`,
        });
        
        // Refresh user data in context
        await refreshUser();
        
        // Redirect based on user type
        if (result.user.user_type === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      } else {
        toast({
          title: isSignUp ? "Sign Up Failed" : "Login Failed",
          description: result.error || "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const AdminLoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="admin-email">Email</Label>
          <Input 
            id="admin-email" 
            type="email" 
            placeholder="admin@grademe.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-password">Password</Label>
          <Input 
            id="admin-password" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button 
          className="w-full" 
          onClick={() => handleAuth('admin', email, password)}
          disabled={isLoading}
        >
          {isLoading 
            ? (isSignUp ? 'Creating account...' : 'Signing in...') 
            : (isSignUp ? 'Create Admin Account' : 'Sign in as Admin')
          }
        </Button>
      </div>
    );
  };

  const StudentLoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="student-email">Email</Label>
          <Input 
            id="student-email" 
            type="email" 
            placeholder="student@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="student-password">Password</Label>
          <Input 
            id="student-password" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button 
          className="w-full" 
          onClick={() => handleAuth('student', email, password)}
          disabled={isLoading}
        >
          {isLoading 
            ? (isSignUp ? 'Creating account...' : 'Signing in...') 
            : (isSignUp ? 'Create Student Account' : 'Sign in as Student')
          }
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-grademe-blue via-grademe-dark-blue to-grademe-blue">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-white rounded-full shadow-lg">
                <GraduationCap className="h-8 w-8 text-grademe-blue" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">GradeMe</h1>
            <p className="text-blue-100 text-lg">Advanced Exam Management System</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Features Section */}
            <div className="text-white space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Why Choose GradeMe?</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-6 w-6 text-grademe-green" />
                  <div>
                    <h3 className="font-medium">Comprehensive Exam Management</h3>
                    <p className="text-sm text-blue-100">Create, manage, and track exams with ease</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-grademe-green" />
                  <div>
                    <h3 className="font-medium">Student Progress Tracking</h3>
                    <p className="text-sm text-blue-100">Monitor performance and provide insights</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 text-grademe-green" />
                  <div>
                    <h3 className="font-medium">Advanced Analytics</h3>
                    <p className="text-sm text-blue-100">Detailed reports and performance metrics</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-grademe-dark-slate">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </CardTitle>
                <CardDescription>
                  {isSignUp ? 'Choose your account type to get started' : 'Choose your login type to continue'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="admin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="admin">Admin</TabsTrigger>
                    <TabsTrigger value="student">Student</TabsTrigger>
                  </TabsList>
                  <TabsContent value="admin" className="mt-6">
                    <AdminLoginForm />
                  </TabsContent>
                  <TabsContent value="student" className="mt-6">
                    <StudentLoginForm />
                  </TabsContent>
                </Tabs>
                
                {/* Sign Up Toggle */}
                <div className="mt-6 text-center">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {isSignUp 
                      ? 'Already have an account? Sign in' 
                      : "Don't have an account? Sign up"
                    }
                  </Button>
                </div>
                
                {/* Custom Auth Status */}
                <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center mb-2">
                    <BookOpen className="h-4 w-4 text-green-600 mr-2" />
                    <h3 className="font-semibold text-green-800 text-sm">Secure Authentication Active</h3>
                  </div>
                  <p className="text-xs text-green-700">
                    Custom authentication with encrypted password storage is enabled. You can create new accounts and sign in securely.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}