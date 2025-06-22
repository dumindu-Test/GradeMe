'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ReaderIcon, TargetIcon, CalendarIcon, ClockIcon, ExitIcon, GearIcon, PlayIcon, BarChartIcon, StarIcon } from '@radix-ui/react-icons';

interface StudentStats {
  totalExams: number;
  averageScore: number;
  bestRank: number;
  projectGoal: number;
}

interface ActiveExam {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  duration: number;
  questions: number;
}

interface ExamHistory {
  id: string;
  title: string;
  subject: string;
  date: string;
  score: number;
  maxScore: number;
  rank: number;
  grade: string;
}

export default function StudentDashboard() {
  const [stats, setStats] = useState<StudentStats>({
    totalExams: 0,
    averageScore: 0,
    bestRank: 0,
    projectGoal: 0
  });
  
  const [activeExams, setActiveExams] = useState<ActiveExam[]>([]);
  const [examHistory, setExamHistory] = useState<ExamHistory[]>([]);
  const router = useRouter();
  const { user } = useAuth();

  console.log('ModernStudentDashboard rendered');

  useEffect(() => {
    console.log('Loading student dashboard data');
    
    setTimeout(() => {
      setStats({
        totalExams: 24,
        averageScore: 87.5,
        bestRank: 3,
        projectGoal: 90
      });

      setActiveExams([
        {
          id: '1',
          title: 'Mathematics Final Exam',
          subject: 'Mathematics',
          dueDate: '2024-06-28',
          duration: 120,
          questions: 50
        },
        {
          id: '2',
          title: 'Physics Midterm',
          subject: 'Physics', 
          dueDate: '2024-06-30',
          duration: 90,
          questions: 40
        }
      ]);

      setExamHistory([
        {
          id: '1',
          title: 'Chemistry Lab Test',
          subject: 'Chemistry',
          date: '2024-06-20',
          score: 92,
          maxScore: 100,
          rank: 2,
          grade: 'A'
        },
        {
          id: '2',
          title: 'English Literature Essay',
          subject: 'English',
          date: '2024-06-18',
          score: 85,
          maxScore: 100,
          rank: 5,
          grade: 'B+'
        }
      ]);
    }, 1000);
  }, []);

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-modern-accent text-white';
    if (grade.startsWith('B')) return 'bg-modern-primary text-white';
    if (grade.startsWith('C')) return 'bg-orange-500 text-white';
    return 'bg-red-500 text-white';
  };

  const handleLogout = () => {
    console.log('Student logout');
    router.push('/');
  };

  const handleTakeExam = (examId: string) => {
    console.log('Taking exam:', examId);
    router.push(`/student/exam/${examId}`);
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
    <div className="min-h-screen bg-modern-hero text-modern-text">
      {/* Modern Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass border-b border-white/10 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold gradient-text">GradeMe Student</h1>
            <div className="flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="glass border-white/20 text-modern-text hover:bg-white/10"
                  onClick={() => router.push('/student/profile')}
                >
                  <GearIcon className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="glass border-white/20 text-modern-text hover:bg-white/10"
                  onClick={handleLogout}
                >
                  <ExitIcon className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </motion.div>
              <Avatar className="border-2 border-modern-primary/30">
                <AvatarImage src="/student-avatar.jpg" alt="Student" />
                <AvatarFallback className="bg-modern-surface text-modern-text">ST</AvatarFallback>
              </Avatar>
            </div>
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
              Welcome back, Student!
            </h2>
            <p className="text-modern-text/70 text-lg">
              Track your progress and excel in your academic journey
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
                    <ReaderIcon className="w-8 h-8 text-modern-primary" />
                    <div className="glass px-3 py-1 rounded-full">
                      <span className="text-xs text-modern-text/80">Semester</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-modern-text mb-1">
                    {stats.totalExams}
                  </div>
                  <p className="text-modern-text/60 text-sm">Total Exams</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02, y: -5 }}>
              <Card className="glass glass-hover border-white/20 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <BarChartIcon className="w-8 h-8 text-modern-accent" />
                    <div className="glass px-3 py-1 rounded-full">
                      <span className="text-xs text-modern-text/80">+5%</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-modern-text mb-1">
                    {stats.averageScore}%
                  </div>
                  <p className="text-modern-text/60 text-sm">Average Score</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02, y: -5 }}>
              <Card className="glass glass-hover border-white/20 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <StarIcon className="w-8 h-8 text-modern-secondary" />
                    <div className="glass px-3 py-1 rounded-full">
                      <span className="text-xs text-modern-text/80">Best</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-modern-text mb-1">
                    #{stats.bestRank}
                  </div>
                  <p className="text-modern-text/60 text-sm">Class Rank</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02, y: -5 }}>
              <Card className="glass glass-hover border-white/20 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <TargetIcon className="w-8 h-8 text-orange-400" />
                    <div className="glass px-3 py-1 rounded-full">
                      <span className="text-xs text-modern-text/80">Goal</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-modern-text mb-1">
                    {stats.averageScore}%
                  </div>
                  <p className="text-modern-text/60 text-sm">Progress</p>
                  <Progress 
                    value={(stats.averageScore / stats.projectGoal) * 100} 
                    className="mt-2 h-2" 
                  />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Active Exams */}
          <motion.div variants={itemVariants}>
            <Card className="glass glass-hover border-white/20">
              <CardHeader>
                <CardTitle className="gradient-text flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  Active Exams
                </CardTitle>
                <CardDescription className="text-modern-text/60">
                  Exams available for you to take
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeExams.map((exam, index) => (
                    <motion.div
                      key={exam.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="glass glass-hover p-6 rounded-xl border border-white/10"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-modern-text text-lg">{exam.title}</h4>
                          <p className="text-modern-text/60">{exam.subject}</p>
                        </div>
                        <Badge className="bg-modern-accent text-white">Available</Badge>
                      </div>
                      
                      <div className="space-y-3 text-sm text-modern-text/70 mb-6">
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          Due: {exam.dueDate}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-2" />
                          Duration: {exam.duration} minutes
                        </div>
                        <div className="flex items-center">
                          <ReaderIcon className="w-4 h-4 mr-2" />
                          Questions: {exam.questions}
                        </div>
                      </div>
                      
                      <Button
                        className="w-full bg-gradient-to-r from-modern-primary to-modern-secondary hover:from-modern-secondary hover:to-modern-accent transition-all duration-300"
                        onClick={() => handleTakeExam(exam.id)}
                      >
                        <PlayIcon className="w-4 h-4 mr-2" />
                        Take Exam
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Results */}
          <motion.div variants={itemVariants}>
            <Card className="glass glass-hover border-white/20">
              <CardHeader>
                <CardTitle className="gradient-text">Recent Exam History</CardTitle>
                <CardDescription className="text-modern-text/60">
                  Your latest exam results and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {examHistory.map((exam, index) => (
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
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-semibold text-modern-text">
                              {exam.score}/{exam.maxScore}
                            </div>
                            <div className="text-sm text-modern-text/60">Rank #{exam.rank}</div>
                          </div>
                          <Badge className={getGradeColor(exam.grade)}>
                            {exam.grade}
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
  );
}