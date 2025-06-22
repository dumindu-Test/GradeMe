'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, GraduationCap, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  console.log('LoginPage rendered');

  const handleLogin = async (userType: 'admin' | 'student', email: string, password: string) => {
    console.log('Login attempt:', { userType, email });
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

    // Simulate authentication
    const validCredentials = {
      admin: { email: 'admin@grademe.com', password: 'admin123' },
      student: { email: 'student@university.edu', password: 'student123' }
    };

    setTimeout(() => {
      setIsLoading(false);
      
      if (email === validCredentials[userType].email && password === validCredentials[userType].password) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${userType}!`,
        });
        
        // Store user info in localStorage (in real app, would use proper auth)
        localStorage.setItem('currentUser', JSON.stringify({ type: userType, email }));
        
        // Redirect based on user type
        if (userType === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    }, 1000);
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
          onClick={() => handleLogin('admin', email, password)}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in as Admin'}
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
          onClick={() => handleLogin('student', email, password)}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in as Student'}
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
                <CardTitle className="text-2xl text-grademe-dark-slate">Welcome Back</CardTitle>
                <CardDescription>Choose your login type to continue</CardDescription>
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
                
                {/* Demo Credentials */}
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-blue-800 text-sm">Demo Credentials:</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}