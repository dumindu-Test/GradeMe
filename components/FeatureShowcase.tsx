'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Settings, 
  BarChart3, 
  Clock, 
  CheckCircle,
  Shield,
  Bell,
  FileText,
  GraduationCap
} from 'lucide-react';

export default function FeatureShowcase() {
  const adminFeatures = [
    {
      icon: <Users className="h-6 w-6 text-grademe-blue" />,
      title: "Student Management",
      description: "Complete CRUD operations for student profiles",
      implemented: true
    },
    {
      icon: <BookOpen className="h-6 w-6 text-grademe-green" />,
      title: "Exam Creation",
      description: "Create comprehensive exams with multiple question types",
      implemented: true
    },
    {
      icon: <FileText className="h-6 w-6 text-grademe-blue" />,
      title: "Question Management",
      description: "Multiple choice, true/false, short answer, and essay questions",
      implemented: true
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-grademe-green" />,
      title: "Analytics Dashboard",
      description: "Track student performance and exam statistics",
      implemented: true
    },
    {
      icon: <Settings className="h-6 w-6 text-grademe-blue" />,
      title: "Profile Management",
      description: "Photo upload, notifications, password management",
      implemented: true
    }
  ];

  const studentFeatures = [
    {
      icon: <Clock className="h-6 w-6 text-grademe-blue" />,
      title: "Timed Exams",
      description: "Take exams with countdown timer and auto-submit",
      implemented: true
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-grademe-green" />,
      title: "Progress Tracking",
      description: "Monitor performance with detailed analytics",
      implemented: true
    },
    {
      icon: <GraduationCap className="h-6 w-6 text-grademe-blue" />,
      title: "Grade Distribution",
      description: "Visual charts showing academic performance",
      implemented: true
    },
    {
      icon: <Bell className="h-6 w-6 text-orange-500" />,
      title: "Notifications",
      description: "Customizable alerts for exams and results",
      implemented: true
    },
    {
      icon: <Shield className="h-6 w-6 text-grademe-green" />,
      title: "Secure Profile",
      description: "Personal information and security management",
      implemented: true
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-grademe-dark-slate mb-4">
          GradeMe Features Overview
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A comprehensive examination management system designed for educational institutions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Admin Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-grademe-blue">Admin Features</CardTitle>
            <CardDescription>Powerful tools for exam management and administration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="p-2 bg-white rounded-lg shadow-sm border">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-grademe-dark-slate">{feature.title}</h4>
                      <Badge className="bg-grademe-green text-white">✓ Done</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-grademe-green">Student Features</CardTitle>
            <CardDescription>Intuitive interface for taking exams and tracking progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="p-2 bg-white rounded-lg shadow-sm border">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-grademe-dark-slate">{feature.title}</h4>
                      <Badge className="bg-grademe-green text-white">✓ Done</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Highlights */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center">System Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-grademe-blue mb-2">5+</div>
              <div className="text-sm text-gray-600">Question Types</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-grademe-green mb-2">Real-time</div>
              <div className="text-sm text-gray-600">Analytics</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500 mb-2">Secure</div>
              <div className="text-sm text-gray-600">File Upload</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-500 mb-2">Responsive</div>
              <div className="text-sm text-gray-600">Design</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}