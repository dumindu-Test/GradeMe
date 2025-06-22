'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithEmailCustom, signUpWithEmailCustom } from '@/lib/custom-auth';
import ModernHero from '@/components/ModernHero';
import ModernAuthCard from '@/components/ModernAuthCard';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();

  console.log('LoginPage rendered', { user: user?.email, loading });

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

  if (loading) {
    return (
      <div className="min-h-screen bg-modern-hero flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-modern-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-modern-hero text-modern-text">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Hero Section */}
        <div className="flex items-center justify-center p-8">
          <ModernHero />
        </div>

        {/* Auth Section - Always Visible */}
        <div className="flex items-center justify-center p-8">
          <ModernAuthCard
            isSignUp={isSignUp}
            isLoading={isLoading}
            onAuth={handleAuth}
            onToggleSignUp={() => setIsSignUp(!isSignUp)}
          />
        </div>
      </div>
    </div>
  );
}