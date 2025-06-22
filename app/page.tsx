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
import { signInWithEmail, signUpWithEmail } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  console.log('LoginPage rendered');

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user && profile) {
      console.log('User already authenticated, redirecting:', profile.user_type);
      if (profile.user_type === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    }
  }, [user, profile, loading, router]);

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
        ? await signUpWithEmail(email, password, userType)
        : await signInWithEmail(email, password);

      if (result.success && result.user) {
        toast({
          title: isSignUp ? "Account Created" : "Login Successful",
          description: isSignUp 
            ? "Please check your email to verify your account."
            : `Welcome back!`,
        });
        
        // For demo mode, we need to manually handle the auth state
        if (!isSupabaseConfigured() && !isSignUp && result.user) {
          // Simulate successful auth for demo mode
          const mockProfile = {
            id: result.user.id,
            email: result.user.email!,
            user_type: result.user.user_metadata?.user_type || userType,
            full_name: result.user.user_metadata?.full_name || '',
            created_at: new Date().toISOString()
          };
          
          // Redirect based on user type
          if (mockProfile.user_type === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/student/dashboard');
          }
        }
        
        // Don't redirect immediately for signup - they need to verify email
        if (!isSignUp) {
          // Redirect will happen via useEffect when auth state updates (for real Supabase)
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
                
                {/* Sign Up Toggle - only show if Supabase is configured */}
                {isSupabaseConfigured() && (
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
                )}
                
                {/* Setup Status */}
                {!isSupabaseConfigured() ? (
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-2">
                      <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
                      <h3 className="font-semibold text-blue-800 text-sm">Demo Mode Active</h3>
                    </div>
                    <div className="text-xs text-blue-700 mb-3">
                      <p>Using demo credentials. Sign up is disabled in demo mode.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div>
                          <div className="font-medium text-blue-700">Admin Login:</div>
                          <div className="text-blue-600">admin@grademe.com / admin123</div>
                        </div>
                        <div>
                          <div className="font-medium text-blue-700">Student Login:</div>
                          <div className="text-blue-600">student@university.edu / student123</div>
                        </div>
                      </div>
                    </div>
                    <details className="text-xs">
                      <summary className="cursor-pointer font-medium text-blue-800 mb-2">
                        Setup Supabase for full functionality
                      </summary>
                      <div className="text-blue-700">
                        <p>To enable full authentication features:</p>
                        <ol className="list-decimal list-inside mt-2 space-y-1">
                          <li>Create a Supabase project at supabase.com</li>
                          <li>Run the SQL setup script in your Supabase dashboard</li>
                          <li>Add environment variables to .env.local:</li>
                          <div className="bg-blue-100 p-2 rounded mt-1 font-mono text-xs">
                            NEXT_PUBLIC_SUPABASE_URL=your_supabase_url<br/>
                            NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
                          </div>
                        </ol>
                      </div>
                    </details>
                  </div>
                ) : (
                  <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center mb-2">
                      <BookOpen className="h-4 w-4 text-green-600 mr-2" />
                      <h3 className="font-semibold text-green-800 text-sm">Supabase Connected</h3>
                    </div>
                    <p className="text-xs text-green-700">
                      Full authentication features are available. You can sign up for new accounts and sign in with existing ones.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}