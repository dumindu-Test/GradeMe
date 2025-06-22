'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Plus, 
  FileText,
  UserCheck,
  Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminNavigation from '@/components/AdminNavigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

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
  const { profile } = useAuth();

  console.log('AdminDashboard rendered');

  useEffect(() => {
    // Simulate API call for dashboard data
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
        },
        {
          id: '4',
          title: 'English Literature Essay',
          subject: 'English',
          date: '2024-06-30',
          status: 'upcoming',
          studentsEnrolled: 105
        }
      ]);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-grademe-green text-white';
      case 'completed': return 'bg-gray-500 text-white';
      case 'upcoming': return 'bg-grademe-blue text-white';
      default: return 'bg-gray-300 text-gray-800';
    }
  };

  return (
    <ProtectedRoute requiredUserType="admin">
      <div className="min-h-screen bg-grademe-gray">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-grademe-dark-slate">GradeMe Admin</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-grademe-dark-slate mb-2">
              Welcome back, {profile?.full_name || 'Admin'}!
            </h2>
            <p className="text-gray-600">Here's what's happening with your exams today.</p>
          </div>

        {/* Quick Navigation */}
        <div className="mb-8">
          <AdminNavigation />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-grademe-blue to-grademe-dark-blue text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
              <p className="text-xs text-blue-100">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-grademe-green to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Exams</CardTitle>
              <BookOpen className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeExams}</div>
              <p className="text-xs text-green-100">Currently running</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-500 to-gray-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Exams</CardTitle>
              <CheckCircle className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedExams}</div>
              <p className="text-xs text-gray-100">This semester</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
              <Clock className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingExams}</div>
              <p className="text-xs text-orange-100">Next 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button 
            className="h-16 text-left justify-start bg-white hover:bg-gray-50 text-grademe-dark-slate border shadow-sm"
            variant="outline"
            onClick={() => router.push('/admin/exams/create')}
          >
            <Plus className="h-6 w-6 mr-3 text-grademe-blue" />
            <div>
              <div className="font-semibold">Create New Exam</div>
              <div className="text-sm text-gray-500">Set up a new examination</div>
            </div>
          </Button>

          <Button 
            className="h-16 text-left justify-start bg-white hover:bg-gray-50 text-grademe-dark-slate border shadow-sm"
            variant="outline"
            onClick={() => router.push('/admin/students')}
          >
            <UserCheck className="h-6 w-6 mr-3 text-grademe-green" />
            <div>
              <div className="font-semibold">Manage Students</div>
              <div className="text-sm text-gray-500">View and edit student information</div>
            </div>
          </Button>

          <Button 
            className="h-16 text-left justify-start bg-white hover:bg-gray-50 text-grademe-dark-slate border shadow-sm"
            variant="outline"
            onClick={() => router.push('/admin/results')}
          >
            <FileText className="h-6 w-6 mr-3 text-orange-500" />
            <div>
              <div className="font-semibold">View Results</div>
              <div className="text-sm text-gray-500">Check exam results and reports</div>
            </div>
          </Button>
        </div>

        {/* Recent Exams */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Exams</CardTitle>
                <CardDescription>Latest examination activities</CardDescription>
              </div>
              <Button 
                variant="outline"
                onClick={() => router.push('/admin/exams')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-grademe-blue/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-grademe-blue" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-grademe-dark-slate">{exam.title}</h4>
                      <p className="text-sm text-gray-600">{exam.subject} • {exam.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">{exam.studentsEnrolled} students</span>
                    <Badge className={getStatusColor(exam.status)}>
                      {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    </ProtectedRoute>
  );
}