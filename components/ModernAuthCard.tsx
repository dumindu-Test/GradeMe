'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonIcon, ReaderIcon, LockClosedIcon } from '@radix-ui/react-icons';

interface ModernAuthCardProps {
  isSignUp: boolean;
  isLoading: boolean;
  onAuth: (userType: 'admin' | 'student', email: string, password: string) => void;
  onToggleSignUp: () => void;
}

export default function ModernAuthCard({ 
  isSignUp, 
  isLoading, 
  onAuth, 
  onToggleSignUp 
}: ModernAuthCardProps) {
  console.log('ModernAuthCard rendered', { isSignUp, isLoading });

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md mx-auto"
    >
      <Card className="glass border-white/20 shadow-2xl backdrop-blur-xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <motion.div variants={itemVariants}>
            <div className="mx-auto w-12 h-12 glass rounded-full flex items-center justify-center mb-4">
              <LockClosedIcon className="w-6 h-6 text-modern-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-modern-text">
              {isSignUp ? 'Join GradeMe' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-modern-text/60">
              {isSignUp ? 'Create your account to get started' : 'Sign in to your account'}
            </CardDescription>
          </motion.div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="admin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-modern-surface/50 backdrop-blur-sm">
                <TabsTrigger 
                  value="admin" 
                  className="data-[state=active]:bg-modern-primary data-[state=active]:text-white"
                >
                  <PersonIcon className="w-4 h-4 mr-2" />
                  Admin
                </TabsTrigger>
                <TabsTrigger 
                  value="student"
                  className="data-[state=active]:bg-modern-primary data-[state=active]:text-white"
                >
                  <ReaderIcon className="w-4 h-4 mr-2" />
                  Student
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="admin" className="space-y-4 mt-6">
                <motion.div variants={itemVariants}>
                  <Label htmlFor="admin-email" className="text-modern-text">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@institution.edu"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="glass border-white/20 text-modern-text placeholder:text-modern-text/50 focus:border-modern-primary"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Label htmlFor="admin-password" className="text-modern-text">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="glass border-white/20 text-modern-text focus:border-modern-primary"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Button
                    className="w-full bg-gradient-to-r from-modern-primary to-modern-secondary hover:from-modern-secondary hover:to-modern-accent transition-all duration-300 font-medium"
                    onClick={() => onAuth('admin', adminEmail, adminPassword)}
                    disabled={isLoading}
                  >
                    {isLoading 
                      ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
                      : (isSignUp ? 'Create Admin Account' : 'Sign In as Admin')
                    }
                  </Button>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="student" className="space-y-4 mt-6">
                <motion.div variants={itemVariants}>
                  <Label htmlFor="student-email" className="text-modern-text">Email</Label>
                  <Input
                    id="student-email"
                    type="email"
                    placeholder="student@university.edu"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="glass border-white/20 text-modern-text placeholder:text-modern-text/50 focus:border-modern-primary"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Label htmlFor="student-password" className="text-modern-text">Password</Label>
                  <Input
                    id="student-password"
                    type="password"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    className="glass border-white/20 text-modern-text focus:border-modern-primary"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Button
                    className="w-full bg-gradient-to-r from-modern-primary to-modern-secondary hover:from-modern-secondary hover:to-modern-accent transition-all duration-300 font-medium"
                    onClick={() => onAuth('student', studentEmail, studentPassword)}
                    disabled={isLoading}
                  >
                    {isLoading 
                      ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
                      : (isSignUp ? 'Create Student Account' : 'Sign In as Student')
                    }
                  </Button>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <Button
              variant="ghost"
              onClick={onToggleSignUp}
              className="text-modern-text/70 hover:text-modern-text hover:bg-white/5"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="glass p-4 rounded-lg border border-modern-accent/20">
            <div className="flex items-center mb-2">
              <LockClosedIcon className="w-4 h-4 text-modern-accent mr-2" />
              <h3 className="font-semibold text-modern-text text-sm">Secure Authentication</h3>
            </div>
            <p className="text-xs text-modern-text/60">
              Advanced encryption with secure password storage. Your data is protected with industry-standard security.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}