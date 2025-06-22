'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Calendar,
  Clock,
  BookOpen,
  ArrowLeft,
  Eye,
  Copy
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface Exam {
  id: string;
  title: string;
  subject: string;
  description: string;
  duration: number;
  totalQuestions: number;
  totalPoints: number;
  status: 'draft' | 'active' | 'completed' | 'scheduled';
  createdDate: string;
  scheduledDate?: string;
  studentsEnrolled: number;
  completedAttempts: number;
}

export default function AdminExams() {
  const [exams, setExams] = useState<Exam[]>([
    {
      id: '1',
      title: 'Mathematics Final Exam',
      subject: 'Mathematics',
      description: 'Comprehensive final examination covering algebra, calculus, and statistics',
      duration: 120,
      totalQuestions: 50,
      totalPoints: 100,
      status: 'active',
      createdDate: '2024-06-15',
      scheduledDate: '2024-06-25',
      studentsEnrolled: 85,
      completedAttempts: 23
    },
    {
      id: '2',
      title: 'Physics Midterm',
      subject: 'Physics',
      description: 'Midterm exam covering mechanics, thermodynamics, and waves',
      duration: 90,
      totalQuestions: 40,
      totalPoints: 80,
      status: 'scheduled',
      createdDate: '2024-06-18',
      scheduledDate: '2024-06-28',
      studentsEnrolled: 92,
      completedAttempts: 0
    },
    {
      id: '3',
      title: 'Chemistry Lab Test',
      subject: 'Chemistry',
      description: 'Laboratory practical examination',
      duration: 60,
      totalQuestions: 25,
      totalPoints: 50,
      status: 'completed',
      createdDate: '2024-06-10',
      scheduledDate: '2024-06-20',
      studentsEnrolled: 78,
      completedAttempts: 78
    },
    {
      id: '4',
      title: 'English Literature Essay',
      subject: 'English',
      description: 'Essay examination on contemporary literature',
      duration: 180,
      totalQuestions: 5,
      totalPoints: 100,
      status: 'draft',
      createdDate: '2024-06-22',
      studentsEnrolled: 0,
      completedAttempts: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  
  const router = useRouter();
  const { toast } = useToast();

  console.log('AdminExams rendered');

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
    const matchesSubject = subjectFilter === 'all' || exam.subject === subjectFilter;
    
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-grademe-green text-white';
      case 'completed': return 'bg-gray-500 text-white';
      case 'scheduled': return 'bg-grademe-blue text-white';
      case 'draft': return 'bg-orange-500 text-white';
      default: return 'bg-gray-300 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4" />;
      case 'completed': return <BookOpen className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'draft': return <Edit className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const handleDeleteExam = (examId: string) => {
    console.log('Deleting exam:', examId);
    setExams(prev => prev.filter(exam => exam.id !== examId));
    toast({
      title: "Success",
      description: "Exam deleted successfully!",
    });
  };

  const handleDuplicateExam = (exam: Exam) => {
    console.log('Duplicating exam:', exam.id);
    const duplicatedExam: Exam = {
      ...exam,
      id: Date.now().toString(),
      title: `${exam.title} (Copy)`,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      studentsEnrolled: 0,
      completedAttempts: 0
    };
    
    setExams(prev => [duplicatedExam, ...prev]);
    toast({
      title: "Success",
      description: "Exam duplicated successfully!",
    });
  };

  const subjects = Array.from(new Set(exams.map(exam => exam.subject)));
  const statusCounts = {
    all: exams.length,
    active: exams.filter(e => e.status === 'active').length,
    scheduled: exams.filter(e => e.status === 'scheduled').length,
    completed: exams.filter(e => e.status === 'completed').length,
    draft: exams.filter(e => e.status === 'draft').length
  };

  return (
    <div className="min-h-screen bg-grademe-gray">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/admin/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-grademe-dark-slate">Exam Management</h1>
            </div>
            <Button 
              onClick={() => router.push('/admin/exams/create')}
              className="bg-grademe-blue hover:bg-grademe-dark-blue"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Exam
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-grademe-blue to-grademe-dark-blue text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{statusCounts.all}</div>
              <div className="text-sm opacity-90">Total Exams</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-grademe-green to-green-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{statusCounts.active}</div>
              <div className="text-sm opacity-90">Active</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{statusCounts.scheduled}</div>
              <div className="text-sm opacity-90">Scheduled</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{statusCounts.completed}</div>
              <div className="text-sm opacity-90">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{statusCounts.draft}</div>
              <div className="text-sm opacity-90">Drafts</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search exams by title or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="scheduled">scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Exams List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredExams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-grademe-dark-slate">{exam.title}</h3>
                      <Badge className={getStatusColor(exam.status)}>
                        {getStatusIcon(exam.status)}
                        <span className="ml-1 capitalize">{exam.status}</span>
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{exam.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-grademe-blue" />
                        <span>{exam.subject}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-grademe-green" />
                        <span>{exam.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-orange-500" />
                        <span>{exam.studentsEnrolled} enrolled</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span>Created {exam.createdDate}</span>
                      </div>
                      <div>
                        <span className="font-medium">{exam.totalQuestions}</span> questions
                      </div>
                      <div>
                        <span className="font-medium">{exam.totalPoints}</span> points
                      </div>
                    </div>

                    {exam.status !== 'draft' && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress: {exam.completedAttempts}/{exam.studentsEnrolled} completed</span>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-grademe-green h-2 rounded-full" 
                              style={{ width: `${exam.studentsEnrolled > 0 ? (exam.completedAttempts / exam.studentsEnrolled) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Dialog open={selectedExam?.id === exam.id} onOpenChange={(open) => setSelectedExam(open ? exam : null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{exam.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Description</h4>
                            <p className="text-gray-600">{exam.description}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Details</h4>
                              <div className="space-y-2 text-sm">
                                <div>Subject: {exam.subject}</div>
                                <div>Duration: {exam.duration} minutes</div>
                                <div>Questions: {exam.totalQuestions}</div>
                                <div>Total Points: {exam.totalPoints}</div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Statistics</h4>
                              <div className="space-y-2 text-sm">
                                <div>Enrolled: {exam.studentsEnrolled}</div>
                                <div>Completed: {exam.completedAttempts}</div>
                                <div>Created: {exam.createdDate}</div>
                                {exam.scheduledDate && <div>Scheduled: {exam.scheduledDate}</div>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/admin/exams/edit/${exam.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDuplicateExam(exam)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Exam</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{exam.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteExam(exam.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExams.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No exams found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' || subjectFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Create your first exam to get started'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && subjectFilter === 'all' && (
                <Button 
                  onClick={() => router.push('/admin/exams/create')}
                  className="bg-grademe-blue hover:bg-grademe-dark-blue"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Exam
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}