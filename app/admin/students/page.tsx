'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  ArrowLeft,
  UserPlus,
  Download,
  Upload
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  program: string;
  year: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  avatar?: string;
  phone: string;
  address: string;
  gpa: number;
  completedExams: number;
  averageScore: number;
}

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      studentId: 'ST2024001',
      program: 'Computer Science',
      year: '3rd Year',
      enrollmentDate: '2022-09-01',
      status: 'active',
      phone: '+1 (555) 123-4567',
      address: '123 Campus Drive, University City',
      gpa: 3.8,
      completedExams: 24,
      averageScore: 87.5
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@university.edu',
      studentId: 'ST2024002',
      program: 'Mathematics',
      year: '2nd Year',
      enrollmentDate: '2023-09-01',
      status: 'active',
      phone: '+1 (555) 234-5678',
      address: '456 Student Lane, University City',
      gpa: 3.9,
      completedExams: 18,
      averageScore: 92.3
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@university.edu',
      studentId: 'ST2024003',
      program: 'Physics',
      year: '4th Year',
      enrollmentDate: '2021-09-01',
      status: 'active',
      phone: '+1 (555) 345-6789',
      address: '789 Education Blvd, University City',
      gpa: 3.7,
      completedExams: 32,
      averageScore: 85.2
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david.kim@university.edu',
      studentId: 'ST2024004',
      program: 'Chemistry',
      year: '1st Year',
      enrollmentDate: '2024-09-01',
      status: 'active',
      phone: '+1 (555) 456-7890',
      address: '321 Scholar Street, University City',
      gpa: 3.6,
      completedExams: 8,
      averageScore: 78.9
    },
    {
      id: '5',
      name: 'Jessica Taylor',
      email: 'jessica.taylor@university.edu',
      studentId: 'ST2023005',
      program: 'Biology',
      year: '4th Year',
      enrollmentDate: '2021-09-01',
      status: 'graduated',
      phone: '+1 (555) 567-8901',
      address: '654 Academic Ave, University City',
      gpa: 3.95,
      completedExams: 45,
      averageScore: 94.1
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [programFilter, setProgramFilter] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: '',
    email: '',
    studentId: '',
    program: '',
    year: '',
    phone: '',
    address: '',
    status: 'active'
  });
  
  const router = useRouter();
  const { toast } = useToast();

  console.log('AdminStudents rendered');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesProgram = programFilter === 'all' || student.program === programFilter;
    
    return matchesSearch && matchesStatus && matchesProgram;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-grademe-green text-white';
      case 'inactive': return 'bg-gray-500 text-white';
      case 'graduated': return 'bg-grademe-blue text-white';
      case 'suspended': return 'bg-red-500 text-white';
      default: return 'bg-gray-300 text-gray-800';
    }
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return 'text-grademe-green';
    if (gpa >= 3.0) return 'text-grademe-blue';
    if (gpa >= 2.5) return 'text-orange-500';
    return 'text-red-500';
  };

  const handleDeleteStudent = (studentId: string) => {
    console.log('Deleting student:', studentId);
    setStudents(prev => prev.filter(student => student.id !== studentId));
    toast({
      title: "Success",
      description: "Student deleted successfully!",
    });
  };

  const handleAddStudent = () => {
    console.log('Adding new student:', newStudent);
    
    if (!newStudent.name || !newStudent.email || !newStudent.studentId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const studentToAdd: Student = {
      id: Date.now().toString(),
      name: newStudent.name || '',
      email: newStudent.email || '',
      studentId: newStudent.studentId || '',
      program: newStudent.program || '',
      year: newStudent.year || '',
      phone: newStudent.phone || '',
      address: newStudent.address || '',
      status: (newStudent.status as Student['status']) || 'active',
      enrollmentDate: new Date().toISOString().split('T')[0],
      gpa: 0,
      completedExams: 0,
      averageScore: 0
    };
    
    setStudents(prev => [studentToAdd, ...prev]);
    setIsAddDialogOpen(false);
    setNewStudent({
      name: '',
      email: '',
      studentId: '',
      program: '',
      year: '',
      phone: '',
      address: '',
      status: 'active'
    });
    
    toast({
      title: "Success",
      description: "Student added successfully!",
    });
  };

  const handleExportStudents = () => {
    console.log('Exporting students data');
    toast({
      title: "Export Started",
      description: "Student data is being exported to CSV...",
    });
  };

  const programs = Array.from(new Set(students.map(student => student.program)));
  const statusCounts = {
    all: students.length,
    active: students.filter(s => s.status === 'active').length,
    inactive: students.filter(s => s.status === 'inactive').length,
    graduated: students.filter(s => s.status === 'graduated').length,
    suspended: students.filter(s => s.status === 'suspended').length
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
              <h1 className="text-2xl font-bold text-grademe-dark-slate">Student Management</h1>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={handleExportStudents}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-grademe-blue hover:bg-grademe-dark-blue">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="student@university.edu"
                      />
                    </div>
                    <div>
                      <Label htmlFor="studentId">Student ID *</Label>
                      <Input
                        id="studentId"
                        value={newStudent.studentId}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, studentId: e.target.value }))}
                        placeholder="ST2024XXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="program">Program</Label>
                      <Input
                        id="program"
                        value={newStudent.program}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, program: e.target.value }))}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    <div>
                      <Label htmlFor="year">Academic Year</Label>
                      <Select onValueChange={(value) => setNewStudent(prev => ({ ...prev, year: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st Year">1st Year</SelectItem>
                          <SelectItem value="2nd Year">2nd Year</SelectItem>
                          <SelectItem value="3rd Year">3rd Year</SelectItem>
                          <SelectItem value="4th Year">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={newStudent.phone}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={newStudent.address}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter address"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddStudent}>
                      Add Student
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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
              <div className="text-sm opacity-90">Total Students</div>
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
              <div className="text-2xl font-bold">{statusCounts.graduated}</div>
              <div className="text-sm opacity-90">Graduated</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{statusCounts.inactive}</div>
              <div className="text-sm opacity-90">Inactive</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{statusCounts.suspended}</div>
              <div className="text-sm opacity-90">Suspended</div>
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
                    placeholder="Search students by name, email, or ID..."
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
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {programs.map(program => (
                    <SelectItem key={program} value={program}>{program}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Students ({filteredStudents.length})</CardTitle>
            <CardDescription>Manage student information and academic records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback className="bg-grademe-blue text-white">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-grademe-dark-slate">{student.name}</h4>
                        <Badge className={getStatusColor(student.status)}>
                          {student.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{student.email}</p>
                      <p className="text-xs text-gray-500">ID: {student.studentId} • {student.program} • {student.year}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-sm font-medium">GPA</div>
                      <div className={`text-lg font-bold ${getGPAColor(student.gpa)}`}>
                        {student.gpa.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Exams</div>
                      <div className="text-lg font-bold text-grademe-dark-slate">
                        {student.completedExams}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Avg Score</div>
                      <div className="text-lg font-bold text-grademe-green">
                        {student.averageScore.toFixed(1)}%
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Student Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={student.avatar} alt={student.name} />
                                <AvatarFallback className="bg-grademe-blue text-white text-lg">
                                  {student.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-xl font-semibold">{student.name}</h3>
                                <p className="text-gray-600">{student.studentId}</p>
                                <Badge className={getStatusColor(student.status)}>
                                  {student.status}
                                </Badge>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Contact Info</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span>{student.email}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span>{student.phone}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Academic Info</h4>
                                <div className="space-y-2 text-sm">
                                  <div>Program: {student.program}</div>
                                  <div>Year: {student.year}</div>
                                  <div>Enrolled: {student.enrollmentDate}</div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Academic Performance</h4>
                              <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-3 bg-grademe-blue/10 rounded">
                                  <div className="text-lg font-bold text-grademe-blue">{student.gpa.toFixed(2)}</div>
                                  <div className="text-xs text-gray-600">GPA</div>
                                </div>
                                <div className="p-3 bg-grademe-green/10 rounded">
                                  <div className="text-lg font-bold text-grademe-green">{student.completedExams}</div>
                                  <div className="text-xs text-gray-600">Exams</div>
                                </div>
                                <div className="p-3 bg-orange-100 rounded">
                                  <div className="text-lg font-bold text-orange-600">{student.averageScore.toFixed(1)}%</div>
                                  <div className="text-xs text-gray-600">Average</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Student</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {student.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteStudent(student.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No students found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== 'all' || programFilter !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'Add your first student to get started'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}