'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Save, 
  Bell,
  Shield,
  User,
  GraduationCap,
  Calendar,
  Mail,
  Phone
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface StudentProfile {
  name: string;
  email: string;
  studentId: string;
  program: string;
  year: string;
  enrollmentDate: string;
  notifications: {
    examReminders: boolean;
    gradeUpdates: boolean;
    announcements: boolean;
    emailNotifications: boolean;
  };
}

export default function StudentProfile() {
  const [profile, setProfile] = useState<StudentProfile>({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    studentId: 'ST2024001',
    program: 'Computer Science',
    year: '3rd Year',
    enrollmentDate: '2022-09-01',
    notifications: {
      examReminders: true,
      gradeUpdates: true,
      announcements: true,
      emailNotifications: true
    }
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const router = useRouter();
  const { toast } = useToast();

  console.log('StudentProfile rendered');

  const handleProfileUpdate = () => {
    console.log('Updating student profile:', profile);
    
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    }, 1000);
  };

  const handlePasswordChange = () => {
    console.log('Changing password');
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setTimeout(() => {
      toast({
        title: "Success",
        description: "Password changed successfully!",
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1000);
  };

  const handleNotificationChange = (key: keyof StudentProfile['notifications'], value: boolean) => {
    console.log('Notification setting changed:', key, value);
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
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
                onClick={() => router.push('/student/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-grademe-dark-slate">My Profile</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-grademe-blue" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your personal details and academic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Section */}
                <div className="flex items-center space-x-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" alt="Profile" />
                    <AvatarFallback className="text-lg bg-grademe-blue text-white">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-semibold text-grademe-dark-slate">{profile.name}</h3>
                    <p className="text-grademe-blue font-medium">{profile.studentId}</p>
                    <p className="text-gray-600">{profile.program} • {profile.year}</p>
                  </div>
                </div>

                <Separator />

                {/* Academic Information */}
                <div>
                  <h4 className="font-semibold text-grademe-dark-slate mb-4 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-grademe-blue" />
                    Academic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Student ID</Label>
                      <Input value={profile.studentId} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <Label>Program</Label>
                      <Input value={profile.program} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <Label>Academic Year</Label>
                      <Input value={profile.year} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <Label>Enrollment Date</Label>
                      <Input value={profile.enrollmentDate} disabled className="bg-gray-50" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div>
                  <h4 className="font-semibold text-grademe-dark-slate mb-4 flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-grademe-blue" />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleProfileUpdate}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-grademe-blue" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to receive notifications about your exams and grades</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Exam Reminders</h4>
                      <p className="text-sm text-gray-600">Get notified about upcoming exams and deadlines</p>
                    </div>
                    <Switch
                      checked={profile.notifications.examReminders}
                      onCheckedChange={(checked) => handleNotificationChange('examReminders', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Grade Updates</h4>
                      <p className="text-sm text-gray-600">Get notified when your exam results are available</p>
                    </div>
                    <Switch
                      checked={profile.notifications.gradeUpdates}
                      onCheckedChange={(checked) => handleNotificationChange('gradeUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Announcements</h4>
                      <p className="text-sm text-gray-600">Receive important announcements from instructors</p>
                    </div>
                    <Switch
                      checked={profile.notifications.announcements}
                      onCheckedChange={(checked) => handleNotificationChange('announcements', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-grademe-blue" />
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive all notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={profile.notifications.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleProfileUpdate}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-grademe-blue" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security and password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 8 characters)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-grademe-dark-slate mb-2">Password Requirements:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Include uppercase and lowercase letters</li>
                    <li>• Include at least one number</li>
                    <li>• Include at least one special character</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handlePasswordChange}>
                    <Shield className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}