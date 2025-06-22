'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { UserMenu } from '@/components/UserMenu';

export default function AdminNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
      path: '/admin/dashboard',
      description: 'Overview and statistics'
    },
    {
      label: 'Exams',
      icon: <BookOpen className="h-4 w-4" />,
      path: '/admin/exams',
      description: 'Manage examinations'
    },
    {
      label: 'Students',
      icon: <Users className="h-4 w-4" />,
      path: '/admin/students',
      description: 'Student management'
    },
    {
      label: 'Results',
      icon: <BarChart3 className="h-4 w-4" />,
      path: '/admin/results',
      description: 'View exam results & analytics'
    },
    {
      label: 'Profile',
      icon: <Settings className="h-4 w-4" />,
      path: '/admin/profile',
      description: 'Account settings'
    }
  ];

  return (
    <Card className="bg-white shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-grademe-dark-slate">Quick Navigation</h3>
          <UserMenu />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={pathname === item.path ? "default" : "outline"}
              className={`h-auto p-3 flex flex-col items-center space-y-2 ${
                pathname === item.path 
                  ? 'bg-grademe-blue hover:bg-grademe-dark-blue' 
                  : 'hover:bg-grademe-blue/10'
              }`}
              onClick={() => router.push(item.path)}
            >
              {item.icon}
              <div className="text-center">
                <div className="text-xs font-medium">{item.label}</div>
                <div className="text-xs opacity-70">{item.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}