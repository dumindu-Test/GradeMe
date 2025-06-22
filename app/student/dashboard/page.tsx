'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Target, 
  Trophy, 
  TrendingUp, 
  Calendar,
  Clock,
  Settings,
  LogOut,
  Play,
  BarChart3,
  Award
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

  console.log('StudentDashboard rendered');

  const performanceData = [
    { month: 'Jan', score: 78 },
    { month: 'Feb', score: 82 },
    { month: 'Mar', score: 79 },
    { month: 'Apr', score: 85 },
    { month: 'May', score: 88 },
    { month: 'Jun', score: 91 }
  ];

  const gradeDistribution = [
    { name: 'A', value: 35, color: '#10b981' },
    { name: 'B', value: 45, color: '#2563eb' },
    { name: 'C', value: 15, color: '#f59e0b' },
    { name: 'D', value: 5, color: '#ef4444' }
  ];

  useEffect(() => {
    // Simulate API call for student dashboard data
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
        },
        {
          id: '3',
          title: 'Biology Quiz',
          subject: 'Biology',
          date: '2024-06-15',
          score: 89,
          maxScore: 100,
          rank: 3,
          grade: 'A-'
        }
      ]);
    }, 1000);
  }, []);

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-grademe-green text-white';
    if (grade.startsWith('B')) return 'bg-grademe-blue text-white';
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

  return (
    <div className="min-h-screen bg-grademe-gray">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-grademe-dark-slate">GradeMe Student</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/student/profile')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Avatar>
                <AvatarImage src="/student-avatar.jpg" alt="Student" />
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-grademe-dark-slate mb-2">Welcome back, Student!</h2>
          <p className="text-gray-600">Track your progress and stay on top of your exams.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-grademe-blue to-grademe-dark-blue text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
              <BookOpen className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalExams}</div>
              <p className="text-xs text-blue-100">Completed this semester</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-grademe-green to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BarChart3 className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
              <p className="text-xs text-green-100">+5% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Rank</CardTitle>
              <Trophy className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{stats.bestRank}</div>
              <p className="text-xs text-orange-100">Class ranking</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
              <Target className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
              <p className="text-xs text-purple-100">Target: {stats.projectGoal}%</p>
              <Progress value={(stats.averageScore / stats.projectGoal) * 100} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-grademe-blue" />
                Performance Trend
              </CardTitle>
              <CardDescription>Your score progression over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Bar dataKey="score" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Grade Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-grademe-green" />
                Grade Distribution
              </CardTitle>
              <CardDescription>Your grade breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Active Exams */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-orange-500" />
              Active Exams
            </CardTitle>
            <CardDescription>Exams available for you to take</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeExams.map((exam) => (
                <div key={exam.id} className="p-4 border rounded-lg bg-gradient-to-r from-white to-blue-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-grademe-dark-slate">{exam.title}</h4>
                      <p className="text-sm text-gray-600">{exam.subject}</p>
                    </div>
                    <Badge className="bg-grademe-green text-white">Available</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Due: {exam.dueDate}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Duration: {exam.duration} minutes
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Questions: {exam.questions}
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => handleTakeExam(exam.id)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Take Exam
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exam History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Exam History</CardTitle>
            <CardDescription>Your latest exam results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {examHistory.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-grademe-blue/10 rounded-lg">
                      <BookOpen className="h-5 w-5 text-grademe-blue" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-grademe-dark-slate">{exam.title}</h4>
                      <p className="text-sm text-gray-600">{exam.subject} • {exam.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold">{exam.score}/{exam.maxScore}</div>
                      <div className="text-sm text-gray-600">Rank #{exam.rank}</div>
                    </div>
                    <Badge className={getGradeColor(exam.grade)}>
                      {exam.grade}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}