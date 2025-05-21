import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Users, Video, FileText, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase, fetchUserCourseProgress } from '@/integrations/supabase/client';

// Mock data for dashboard statistics
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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [studentStats, setStudentStats] = useState({
    enrolledCourses: 3,
    completedLessons: 0,
    totalLessons: 30,
    downloadedResources: 15,
  });
  
  // Load student stats
  useEffect(() => {
    const loadStudentStats = async () => {
      if (!user?.id || user.role !== 'student') {
        setIsLoading(false);
        return;
      }
      
      try {
        // For now, we'll just calculate based on the mock courses
        // In a real app, you'd fetch this from Supabase
        const courseIds = [1, 2, 3]; // Mock course IDs
        let totalCompleted = 0;
        
        // For each course, get progress
        await Promise.all(courseIds.map(async (courseId) => {
          const progress = await fetchUserCourseProgress(user.id, courseId);
          if (progress?.completed_modules) {
            totalCompleted += progress.completed_modules.length;
          }
        }));
        
        setStudentStats({
          ...studentStats,
          completedLessons: totalCompleted,
        });
      } catch (error) {
        console.error('Error loading student stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStudentStats();
  }, [user]);

  // Render different dashboard based on user role
  const renderDashboard = () => {
    switch(user?.role) {
      case 'student':
        return <StudentDashboard stats={studentStats} isLoading={isLoading} />;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || 'User'}!</p>
        </div>
        
        <Button 
          variant="outline" 
          className="hidden md:flex" 
          onClick={() => navigate('/courses')}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Browse Courses
        </Button>
      </div>
      
      {renderDashboard()}
      
      <div className="block md:hidden mt-4">
        <Button 
          className="w-full" 
          onClick={() => navigate('/courses')}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Browse Courses
        </Button>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ElementType;
  className?: string;
  isLoading?: boolean;
}

const StatCard = ({ title, value, description, icon: Icon, className, isLoading = false }: StatCardProps) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
      ) : (
        <>
          <div className="text-2xl font-bold">{value}</div>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </>
      )}
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
  isLoading: boolean;
}

const StudentDashboard = ({ stats, isLoading }: StudentDashboardProps) => {
  const completionPercentage = Math.round((stats.completedLessons / stats.totalLessons) * 100);
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Enrolled Courses" 
          value={stats.enrolledCourses} 
          icon={BookOpen}
          className="border-l-4 border-nmca-blue"
          isLoading={isLoading}
        />
        <StatCard 
          title="Completion Rate" 
          value={`${isLoading ? '-' : completionPercentage}%`} 
          description={`${stats.completedLessons} of ${stats.totalLessons} lessons completed`}
          icon={Video}
          className="border-l-4 border-green-500"
          isLoading={isLoading}
        />
        <StatCard 
          title="Resources Accessed" 
          value={stats.downloadedResources} 
          icon={FileText}
          className="border-l-4 border-amber-500"
          isLoading={isLoading}
        />
        <StatCard 
          title="Learning Streak" 
          value="5 days" 
          description="Keep going! You're doing great!"
          icon={TrendingUp}
          className="border-l-4 border-purple-500"
          isLoading={isLoading}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recently Watched</CardTitle>
            <CardDescription>Continue where you left off</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded bg-gray-200 animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded bg-nmca-gray flex items-center justify-center">
                    <Video className="h-6 w-6 text-nmca-blue" />
                  </div>
                  <div>
                    <p className="font-medium">Introduction to Financial Auditing</p>
                    <p className="text-sm text-muted-foreground">Watched 70% - Continue</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded bg-nmca-gray flex items-center justify-center">
                    <Video className="h-6 w-6 text-nmca-blue" />
                  </div>
                  <div>
                    <p className="font-medium">Auditing Standards and Frameworks</p>
                    <p className="text-sm text-muted-foreground">Watched 30% - Continue</p>
                  </div>
                </li>
              </ul>
            )}
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/courses/1')}
              >
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Courses</CardTitle>
            <CardDescription>Active enrollments</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded bg-gray-200 animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
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
            )}
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/courses')}
              >
                View All Courses
              </Button>
            </div>
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
  const navigate = useNavigate();
  
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
            
            <div className="mt-4 flex flex-col gap-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast.info("Upload functionality coming soon!")}
              >
                Upload New Content
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/staff/students')}
              >
                View Student Details
              </Button>
            </div>
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
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/courses')}
              >
                View All Courses
              </Button>
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
  const navigate = useNavigate();
  
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
            
            <div className="mt-4 space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/admin/activity-logs')}
              >
                View Activity Logs
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Students</p>
                <p className="text-sm text-muted-foreground">Manage student accounts</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => navigate('/admin/students')}
              >
                Manage
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Staff</p>
                <p className="text-sm text-muted-foreground">Manage staff accounts</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => navigate('/admin/staff')}
              >
                Manage
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Courses</p>
                <p className="text-sm text-muted-foreground">Manage course content</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => navigate('/courses')}
              >
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
