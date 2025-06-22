'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { PersonIcon, ReaderIcon, CheckCircledIcon, ClockIcon, PlusIcon, FileTextIcon } from '@radix-ui/react-icons';

interface DashboardStats {
  totalStudents: number;
  activeExams: number;
  completedExams: number;
  upcomingExams: number;
}

interface RecentExam {
  id: string;
  title: string;
  subject: string;
  date: string;
  status: 'active' | 'completed' | 'upcoming';
  studentsEnrolled: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeExams: 0,
    completedExams: 0,
    upcomingExams: 0
  });
  
  const [recentExams, setRecentExams] = useState<RecentExam[]>([]);
  const router = useRouter();
  const { user } = useAuth();

  console.log('ModernAdminDashboard rendered');

  useEffect(() => {
    console.log('Loading admin dashboard data');
    
    setTimeout(() => {
      setStats({
        totalStudents: 1247,
        activeExams: 8,
        completedExams: 45,
        upcomingExams: 12
      });

      setRecentExams([
        {
          id: '1',
          title: 'Mathematics Final Exam',
          subject: 'Mathematics',
          date: '2024-06-25',
          status: 'active',
          studentsEnrolled: 85
        },
        {
          id: '2',
          title: 'Physics Midterm',
          subject: 'Physics',
          date: '2024-06-28',
          status: 'upcoming',
          studentsEnrolled: 92
        },
        {
          id: '3',
          title: 'Chemistry Lab Test',
          subject: 'Chemistry',
          date: '2024-06-20',
          status: 'completed',
          studentsEnrolled: 78
        }
      ]);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-modern-accent text-white';
      case 'completed': return 'bg-modern-muted text-white';
      case 'upcoming': return 'bg-modern-primary text-white';
      default: return 'bg-modern-surface text-modern-text';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <ProtectedRoute requiredUserType="admin">
      <div className="min-h-screen bg-modern-hero text-modern-text">
        {/* Modern Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass border-b border-white/10 sticky top-0 z-50"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold gradient-text">GradeMe Admin</h1>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="glass px-4 py-2 rounded-full"
              >
                <span className="text-modern-text/80">Welcome, {user?.full_name || 'Admin'}</span>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Floating orbs */}
        <div className="floating-orb w-96 h-96 -top-48 -right-48 opacity-20" />
        <div className="floating-orb w-64 h-64 bottom-20 -left-32 opacity-15" />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Welcome Section */}
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-4xl font-bold gradient-text mb-4">
                Dashboard Overview
              </h2>
              <p className="text-modern-text/70 text-lg">
                Monitor your educational platform's performance and activity
              </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.div whileHover={{ scale: 1.02, y: -5 }}>
                <Card className="glass glass-hover border-white/20 overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <PersonIcon className="w-8 h-8 text-modern-primary" />
                      <div className="glass px-3 py-1 rounded-full">
                        <span className="text-xs text-modern-text/80">+12%</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-modern-text mb-1">
                      {stats.totalStudents.toLocaleString()}
                    </div>
                    <p className="text-modern-text/60 text-sm">Total Students</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02, y: -5 }}>
                <Card className="glass glass-hover border-white/20 overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <ReaderIcon className="w-8 h-8 text-modern-accent" />
                      <div className="glass px-3 py-1 rounded-full">
                        <span className="text-xs text-modern-text/80">Live</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-modern-text mb-1">
                      {stats.activeExams}
                    </div>
                    <p className="text-modern-text/60 text-sm">Active Exams</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02, y: -5 }}>
                <Card className="glass glass-hover border-white/20 overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CheckCircledIcon className="w-8 h-8 text-modern-secondary" />
                      <div className="glass px-3 py-1 rounded-full">
                        <span className="text-xs text-modern-text/80">Complete</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-modern-text mb-1">
                      {stats.completedExams}
                    </div>
                    <p className="text-modern-text/60 text-sm">Completed</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02, y: -5 }}>
                <Card className="glass glass-hover border-white/20 overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <ClockIcon className="w-8 h-8 text-orange-400" />
                      <div className="glass px-3 py-1 rounded-full">
                        <span className="text-xs text-modern-text/80">30d</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-modern-text mb-1">
                      {stats.upcomingExams}
                    </div>
                    <p className="text-modern-text/60 text-sm">Upcoming</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  className="w-full h-20 glass glass-hover border-white/20 justify-start text-left p-6"
                  variant="outline"
                  onClick={() => router.push('/admin/exams/create')}
                >
                  <PlusIcon className="w-6 h-6 mr-4 text-modern-primary" />
                  <div>
                    <div className="font-semibold text-modern-text">Create New Exam</div>
                    <div className="text-sm text-modern-text/60">Set up examination</div>
                  </div>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  className="w-full h-20 glass glass-hover border-white/20 justify-start text-left p-6"
                  variant="outline"
                  onClick={() => router.push('/admin/students')}
                >
                  <PersonIcon className="w-6 h-6 mr-4 text-modern-accent" />
                  <div>
                    <div className="font-semibold text-modern-text">Manage Students</div>
                    <div className="text-sm text-modern-text/60">View student data</div>
                  </div>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  className="w-full h-20 glass glass-hover border-white/20 justify-start text-left p-6"
                  variant="outline"
                  onClick={() => router.push('/admin/results')}
                >
                  <FileTextIcon className="w-6 h-6 mr-4 text-modern-secondary" />
                  <div>
                    <div className="font-semibold text-modern-text">View Results</div>
                    <div className="text-sm text-modern-text/60">Check reports</div>
                  </div>
                </Button>
              </motion.div>
            </motion.div>

            {/* Recent Exams */}
            <motion.div variants={itemVariants}>
              <Card className="glass glass-hover border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-modern-text gradient-text">Recent Exams</CardTitle>
                      <CardDescription className="text-modern-text/60">
                        Latest examination activities
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      className="glass border-white/20 text-modern-text hover:bg-white/10"
                      onClick={() => router.push('/admin/exams')}
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentExams.map((exam, index) => (
                      <motion.div
                        key={exam.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass glass-hover p-4 rounded-xl border border-white/10"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 glass rounded-xl flex items-center justify-center">
                              <ReaderIcon className="w-5 h-5 text-modern-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-modern-text">{exam.title}</h4>
                              <p className="text-sm text-modern-text/60">{exam.subject} • {exam.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-modern-text/60">
                              {exam.studentsEnrolled} students
                            </span>
                            <Badge className={getStatusColor(exam.status)}>
                              {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  );
}