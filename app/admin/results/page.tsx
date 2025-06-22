'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Download, 
  FileText,
  BarChart3,
  Trophy,
  TrendingUp,
  ArrowLeft,
  Calendar,
  Users,
  Target,
  Filter
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  subject: string;
  studentId: string;
  studentName: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  submittedAt: string;
  timeSpent: number; // in minutes
  rank: number;
  totalStudents: number;
}

interface ExamSummary {
  examId: string;
  examTitle: string;
  subject: string;
  totalStudents: number;
  completedAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  examDate: string;
}

export default function AdminResults() {
  const [results, setResults] = useState<ExamResult[]>([
    {
      id: '1',
      examId: 'exam1',
      examTitle: 'Mathematics Final Exam',
      subject: 'Mathematics',
      studentId: 'ST2024001',
      studentName: 'Sarah Johnson',
      score: 92,
      maxScore: 100,
      percentage: 92,
      grade: 'A',
      submittedAt: '2024-06-20T10:30:00Z',
      timeSpent: 115,
      rank: 2,
      totalStudents: 85
    },
    {
      id: '2',
      examId: 'exam1',
      examTitle: 'Mathematics Final Exam',
      subject: 'Mathematics',
      studentId: 'ST2024002',
      studentName: 'Michael Chen',
      score: 96,
      maxScore: 100,
      percentage: 96,
      grade: 'A+',
      submittedAt: '2024-06-20T09:45:00Z',
      timeSpent: 108,
      rank: 1,
      totalStudents: 85
    },
    {
      id: '3',
      examId: 'exam2',
      examTitle: 'Physics Midterm',
      subject: 'Physics',
      studentId: 'ST2024003',
      studentName: 'Emily Rodriguez',
      score: 78,
      maxScore: 90,
      percentage: 86.7,
      grade: 'B+',
      submittedAt: '2024-06-18T14:20:00Z',
      timeSpent: 87,
      rank: 5,
      totalStudents: 92
    },
    {
      id: '4',
      examId: 'exam3',
      examTitle: 'Chemistry Lab Test',
      subject: 'Chemistry',
      studentId: 'ST2024004',
      studentName: 'David Kim',
      score: 42,
      maxScore: 50,
      percentage: 84,
      grade: 'B',
      submittedAt: '2024-06-19T11:10:00Z',
      timeSpent: 58,
      rank: 8,
      totalStudents: 78
    }
  ]);

  const [examSummaries, setExamSummaries] = useState<ExamSummary[]>([
    {
      examId: 'exam1',
      examTitle: 'Mathematics Final Exam',
      subject: 'Mathematics',
      totalStudents: 85,
      completedAttempts: 82,
      averageScore: 78.5,
      highestScore: 96,
      lowestScore: 45,
      passRate: 85.4,
      examDate: '2024-06-20'
    },
    {
      examId: 'exam2',
      examTitle: 'Physics Midterm',
      subject: 'Physics',
      totalStudents: 92,
      completedAttempts: 89,
      averageScore: 72.8,
      highestScore: 94,
      lowestScore: 38,
      passRate: 79.8,
      examDate: '2024-06-18'
    },
    {
      examId: 'exam3',
      examTitle: 'Chemistry Lab Test',
      subject: 'Chemistry',
      totalStudents: 78,
      completedAttempts: 78,
      averageScore: 81.2,
      highestScore: 98,
      lowestScore: 52,
      passRate: 92.3,
      examDate: '2024-06-19'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [examFilter, setExamFilter] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  
  const router = useRouter();
  const { toast } = useToast();

  console.log('AdminResults rendered');

  const filteredResults = results.filter(result => {
    const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.examTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || result.subject === subjectFilter;
    const matchesExam = examFilter === 'all' || result.examId === examFilter;
    const matchesGrade = gradeFilter === 'all' || result.grade === gradeFilter;
    
    return matchesSearch && matchesSubject && matchesExam && matchesGrade;
  });

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-grademe-green text-white';
    if (grade.startsWith('B')) return 'bg-grademe-blue text-white';
    if (grade.startsWith('C')) return 'bg-orange-500 text-white';
    if (grade.startsWith('D')) return 'bg-red-400 text-white';
    return 'bg-red-500 text-white';
  };

  const handleExportResults = (type: 'csv' | 'pdf') => {
    console.log(`Exporting results as ${type.toUpperCase()}`);
    toast({
      title: "Export Started",
      description: `Results are being exported as ${type.toUpperCase()}...`,
    });
  };

  const subjects = Array.from(new Set(results.map(result => result.subject)));
  const exams = Array.from(new Set(results.map(result => ({ id: result.examId, title: result.examTitle })).map(e => JSON.stringify(e)))).map(e => JSON.parse(e));
  const grades = Array.from(new Set(results.map(result => result.grade)));

  // Analytics data
  const scoreDistribution = [
    { range: '90-100', count: results.filter(r => r.percentage >= 90).length },
    { range: '80-89', count: results.filter(r => r.percentage >= 80 && r.percentage < 90).length },
    { range: '70-79', count: results.filter(r => r.percentage >= 70 && r.percentage < 80).length },
    { range: '60-69', count: results.filter(r => r.percentage >= 60 && r.percentage < 70).length },
    { range: '0-59', count: results.filter(r => r.percentage < 60).length }
  ];

  const subjectPerformance = subjects.map(subject => ({
    subject,
    average: Math.round(results.filter(r => r.subject === subject).reduce((acc, r) => acc + r.percentage, 0) / results.filter(r => r.subject === subject).length * 10) / 10,
    count: results.filter(r => r.subject === subject).length
  }));

  const gradeDistribution = grades.map(grade => ({
    name: grade,
    value: results.filter(r => r.grade === grade).length,
    color: grade.startsWith('A') ? '#10b981' : grade.startsWith('B') ? '#2563eb' : grade.startsWith('C') ? '#f59e0b' : '#ef4444'
  }));

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
              <h1 className="text-2xl font-bold text-grademe-dark-slate">Results & Analytics</h1>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={() => handleExportResults('csv')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleExportResults('pdf')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-grademe-blue to-grademe-dark-blue text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{results.length}</div>
                      <div className="text-sm opacity-90">Total Results</div>
                    </div>
                    <FileText className="h-8 w-8 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-grademe-green to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">
                        {Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length)}%
                      </div>
                      <div className="text-sm opacity-90">Average Score</div>
                    </div>
                    <BarChart3 className="h-8 w-8 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{Math.max(...results.map(r => r.percentage))}%</div>
                      <div className="text-sm opacity-90">Highest Score</div>
                    </div>
                    <Trophy className="h-8 w-8 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">
                        {Math.round(results.filter(r => r.percentage >= 60).length / results.length * 100)}%
                      </div>
                      <div className="text-sm opacity-90">Pass Rate</div>
                    </div>
                    <Target className="h-8 w-8 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Exam Summaries */}
            <Card>
              <CardHeader>
                <CardTitle>Exam Performance Summary</CardTitle>
                <CardDescription>Overview of all completed exams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {examSummaries.map((exam) => (
                    <div key={exam.examId} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-grademe-dark-slate">{exam.examTitle}</h4>
                          <p className="text-sm text-gray-600">{exam.subject} • {exam.examDate}</p>
                        </div>
                        <Badge className="bg-grademe-blue text-white">
                          {exam.completedAttempts}/{exam.totalStudents} completed
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <div className="text-xs text-gray-500">Average Score</div>
                          <div className="font-semibold text-grademe-blue">{exam.averageScore}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Highest</div>
                          <div className="font-semibold text-grademe-green">{exam.highestScore}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Lowest</div>
                          <div className="font-semibold text-red-500">{exam.lowestScore}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Pass Rate</div>
                          <div className="font-semibold text-grademe-green">{exam.passRate}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Completion</div>
                          <div className="font-semibold text-grademe-dark-slate">
                            {Math.round((exam.completedAttempts / exam.totalStudents) * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Detailed Results Tab */}
          <TabsContent value="detailed" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search by student name, exam, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
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
                  <Select value={examFilter} onValueChange={setExamFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by exam" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Exams</SelectItem>
                      {exams.map(exam => (
                        <SelectItem key={exam.id} value={exam.id}>{exam.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={gradeFilter} onValueChange={setGradeFilter}>
                    <SelectTrigger className="w-full md:w-32">
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grades</SelectItem>
                      {grades.sort().map(grade => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Results Table */}
            <Card>
              <CardHeader>
                <CardTitle>Individual Results ({filteredResults.length})</CardTitle>
                <CardDescription>Detailed breakdown of student performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredResults.map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-grademe-dark-slate">{result.studentName}</h4>
                          <Badge variant="outline">{result.studentId}</Badge>
                          <Badge className={getGradeColor(result.grade)}>
                            {result.grade}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{result.examTitle} • {result.subject}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Submitted: {new Date(result.submittedAt).toLocaleDateString()}</span>
                          <span>Time: {result.timeSpent} min</span>
                          <span>Rank: #{result.rank} of {result.totalStudents}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-grademe-blue">
                          {result.score}/{result.maxScore}
                        </div>
                        <div className="text-lg font-semibold text-grademe-green">
                          {result.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredResults.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No results found</h3>
                    <p className="text-gray-500">
                      {searchTerm || subjectFilter !== 'all' || examFilter !== 'all' || gradeFilter !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'No exam results available yet'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Score Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                  <CardDescription>Distribution of scores across all exams</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={scoreDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Grade Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>Breakdown of grades achieved</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={gradeDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {gradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Subject Performance */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Subject Performance Comparison</CardTitle>
                  <CardDescription>Average performance across different subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subjectPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <Bar dataKey="average" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>Key metrics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-grademe-blue/10 rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-grademe-blue" />
                    <div className="text-2xl font-bold text-grademe-blue">
                      {results.filter(r => r.percentage >= 90).length}
                    </div>
                    <div className="text-sm text-gray-600">Excellent Performance (90%+)</div>
                  </div>
                  
                  <div className="text-center p-4 bg-grademe-green/10 rounded-lg">
                    <Target className="h-8 w-8 mx-auto mb-2 text-grademe-green" />
                    <div className="text-2xl font-bold text-grademe-green">
                      {Math.round(results.reduce((acc, r) => acc + r.timeSpent, 0) / results.length)}min
                    </div>
                    <div className="text-sm text-gray-600">Average Time Spent</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-100 rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold text-orange-600">
                      {subjects.length}
                    </div>
                    <div className="text-sm text-gray-600">Active Subjects</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}