
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Users, Video, FileText } from 'lucide-react';

// Mock data for dashboard statistics
const studentStats = {
  enrolledCourses: 4,
  completedLessons: 24,
  totalLessons: 52,
  downloadedResources: 15,
};

const staffStats = {
  courses: 3,
  students: 87,
  videos: 36,
  resources: 22,
};

const adminStats = {
  courses: 12,
  students: 246,
  staff: 8,
  videos: 124,
};

const Dashboard = () => {
  const { user } = useAuth();

  // Render different dashboard based on user role
  const renderDashboard = () => {
    switch(user?.role) {
      case 'student':
        return <StudentDashboard stats={studentStats} />;
      case 'staff':
        return <StaffDashboard stats={staffStats} />;
      case 'admin':
        return <AdminDashboard stats={adminStats} />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
      
      {renderDashboard()}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ElementType;
  className?: string;
}

const StatCard = ({ title, value, description, icon: Icon, className }: StatCardProps) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

interface StudentDashboardProps {
  stats: {
    enrolledCourses: number;
    completedLessons: number;
    totalLessons: number;
    downloadedResources: number;
  };
}

const StudentDashboard = ({ stats }: StudentDashboardProps) => {
  const completionPercentage = Math.round((stats.completedLessons / stats.totalLessons) * 100);
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Enrolled Courses" 
          value={stats.enrolledCourses} 
          icon={BookOpen}
          className="border-l-4 border-nmca-blue"
        />
        <StatCard 
          title="Completion Rate" 
          value={`${completionPercentage}%`} 
          description={`${stats.completedLessons} of ${stats.totalLessons} lessons completed`}
          icon={Video}
          className="border-l-4 border-green-500"
        />
        <StatCard 
          title="Resources Accessed" 
          value={stats.downloadedResources} 
          icon={FileText}
          className="border-l-4 border-amber-500"
        />
        <StatCard 
          title="Latest Activity" 
          value="2 days ago" 
          description="Viewed Introduction to Auditing"
          icon={Users}
          className="border-l-4 border-purple-500"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recently Watched</CardTitle>
            <CardDescription>Continue where you left off</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="h-12 w-12 rounded bg-nmca-gray flex items-center justify-center">
                  <Video className="h-6 w-6 text-nmca-blue" />
                </div>
                <div>
                  <p className="font-medium">Introduction to Financial Statements</p>
                  <p className="text-sm text-muted-foreground">Watched 70% - Continue</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-12 w-12 rounded bg-nmca-gray flex items-center justify-center">
                  <Video className="h-6 w-6 text-nmca-blue" />
                </div>
                <div>
                  <p className="font-medium">Balance Sheet Analysis</p>
                  <p className="text-sm text-muted-foreground">Watched 30% - Continue</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Courses</CardTitle>
            <CardDescription>Active enrollments</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="h-12 w-12 rounded bg-nmca-gray flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-nmca-blue" />
                </div>
                <div>
                  <p className="font-medium">Financial Auditing 101</p>
                  <p className="text-sm text-muted-foreground">Dr. Jane Smith • 8 modules</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-12 w-12 rounded bg-nmca-gray flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-nmca-blue" />
                </div>
                <div>
                  <p className="font-medium">Corporate Accounting</p>
                  <p className="text-sm text-muted-foreground">Prof. Robert Johnson • 12 modules</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StaffDashboardProps {
  stats: {
    courses: number;
    students: number;
    videos: number;
    resources: number;
  };
}

const StaffDashboard = ({ stats }: StaffDashboardProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Courses" 
          value={stats.courses} 
          icon={BookOpen}
          className="border-l-4 border-nmca-blue"
        />
        <StatCard 
          title="Students" 
          value={stats.students} 
          icon={Users}
          className="border-l-4 border-green-500"
        />
        <StatCard 
          title="Videos" 
          value={stats.videos} 
          icon={Video}
          className="border-l-4 border-amber-500"
        />
        <StatCard 
          title="Resources" 
          value={stats.resources} 
          icon={FileText}
          className="border-l-4 border-purple-500"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
            <CardDescription>Your latest content</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="h-12 w-12 rounded bg-nmca-gray flex items-center justify-center">
                  <Video className="h-6 w-6 text-nmca-blue" />
                </div>
                <div>
                  <p className="font-medium">Auditing Standards Overview</p>
                  <p className="text-sm text-muted-foreground">Uploaded 2 days ago • 18 views</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-12 w-12 rounded bg-nmca-gray flex items-center justify-center">
                  <FileText className="h-6 w-6 text-nmca-blue" />
                </div>
                <div>
                  <p className="font-medium">Case Study: XYZ Corporation</p>
                  <p className="text-sm text-muted-foreground">Uploaded 5 days ago • 42 downloads</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Student Progress</CardTitle>
            <CardDescription>Course completion overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">Financial Auditing 101</p>
                  <span className="text-sm font-medium">68%</span>
                </div>
                <div className="h-2 rounded bg-nmca-gray overflow-hidden">
                  <div className="h-full bg-nmca-blue" style={{ width: '68%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">Corporate Accounting</p>
                  <span className="text-sm font-medium">42%</span>
                </div>
                <div className="h-2 rounded bg-nmca-gray overflow-hidden">
                  <div className="h-full bg-nmca-blue" style={{ width: '42%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">Tax Auditing Principles</p>
                  <span className="text-sm font-medium">87%</span>
                </div>
                <div className="h-2 rounded bg-nmca-gray overflow-hidden">
                  <div className="h-full bg-nmca-blue" style={{ width: '87%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface AdminDashboardProps {
  stats: {
    courses: number;
    students: number;
    staff: number;
    videos: number;
  };
}

const AdminDashboard = ({ stats }: AdminDashboardProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Courses" 
          value={stats.courses} 
          icon={BookOpen}
          className="border-l-4 border-nmca-blue"
        />
        <StatCard 
          title="Students" 
          value={stats.students} 
          icon={Users}
          className="border-l-4 border-green-500"
        />
        <StatCard 
          title="Staff" 
          value={stats.staff} 
          icon={Users}
          className="border-l-4 border-amber-500"
        />
        <StatCard 
          title="Total Content" 
          value={stats.videos} 
          icon={Video}
          className="border-l-4 border-purple-500"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>System-wide activity log</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="h-12 w-12 rounded bg-nmca-gray flex items-center justify-center">
                  <Users className="h-6 w-6 text-nmca-blue" />
                </div>
                <div>
                  <p className="font-medium">New User Registration</p>
                  <p className="text-sm text-muted-foreground">John Smith registered as Student • 2 hours ago</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-12 w-12 rounded bg-nmca-gray flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-nmca-blue" />
                </div>
                <div>
                  <p className="font-medium">New Course Created</p>
                  <p className="text-sm text-muted-foreground">Advanced Auditing by Prof. Williams • 1 day ago</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-12 w-12 rounded bg-nmca-gray flex items-center justify-center">
                  <Video className="h-6 w-6 text-nmca-blue" />
                </div>
                <div>
                  <p className="font-medium">Content Upload</p>
                  <p className="text-sm text-muted-foreground">15 new videos added by Dr. Jane Smith • 2 days ago</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Items requiring admin action</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded bg-nmca-gray flex items-center justify-center">
                    <Users className="h-6 w-6 text-nmca-blue" />
                  </div>
                  <div>
                    <p className="font-medium">Course Enrollment Requests</p>
                    <p className="text-sm text-muted-foreground">8 pending requests</p>
                  </div>
                </div>
                <button className="text-sm text-nmca-blue hover:underline">
                  Review
                </button>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded bg-nmca-gray flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-nmca-blue" />
                  </div>
                  <div>
                    <p className="font-medium">New Course Proposals</p>
                    <p className="text-sm text-muted-foreground">3 pending approvals</p>
                  </div>
                </div>
                <button className="text-sm text-nmca-blue hover:underline">
                  Review
                </button>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded bg-nmca-gray flex items-center justify-center">
                    <Users className="h-6 w-6 text-nmca-blue" />
                  </div>
                  <div>
                    <p className="font-medium">Staff Access Requests</p>
                    <p className="text-sm text-muted-foreground">2 pending requests</p>
                  </div>
                </div>
                <button className="text-sm text-nmca-blue hover:underline">
                  Review
                </button>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
