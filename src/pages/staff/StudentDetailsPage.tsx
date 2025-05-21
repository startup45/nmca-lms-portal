
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { ProgressBadge } from '@/components/ui/progress-badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Define interfaces for our data
interface Course {
  id: number;
  title: string;
}

interface EnrollmentWithProgress {
  courseId: number;
  courseTitle: string;
  progress: number;
}

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  enrollments: EnrollmentWithProgress[];
}

// Mock data generator
const generateMockStudents = (count: number) => {
  const courses = [
    { id: 1, title: 'Financial Auditing 101' },
    { id: 2, title: 'Corporate Accounting' },
    { id: 3, title: 'Tax Auditing Principles' },
    { id: 4, title: 'Advanced Auditing Standards' },
    { id: 5, title: 'Forensic Accounting' }
  ];
  
  const students: Student[] = [];
  
  for (let i = 1; i <= count; i++) {
    // Generate 1-3 random enrollments
    const enrollmentCount = Math.floor(Math.random() * 3) + 1;
    const shuffledCourses = [...courses].sort(() => 0.5 - Math.random());
    const enrollments: EnrollmentWithProgress[] = [];
    
    // Assign random courses and progress
    for (let j = 0; j < enrollmentCount && j < shuffledCourses.length; j++) {
      const course = shuffledCourses[j];
      enrollments.push({
        courseId: course.id,
        courseTitle: course.title,
        progress: Math.floor(Math.random() * 70) + 20, // 20-90% progress
      });
    }
    
    // Create the student
    students.push({
      id: `student-${i}`,
      name: `Student ${i}`,
      rollNumber: `NMC${2023000 + i}`,
      email: `student${i}@example.com`,
      enrollments,
    });
  }
  
  return students;
};

const StudentDetailsPage: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load students data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we would fetch from Supabase
        // For now, we'll use mock data
        setTimeout(() => {
          const mockStudents = generateMockStudents(87); // 87 students as requested
          setStudents(mockStudents);
          setIsLoading(false);
        }, 800); // Simulate loading delay
      } catch (error) {
        console.error('Error fetching student data:', error);
        toast.error('Failed to load student data');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate most recent activity timestamp
  const getActivityTimestamp = () => {
    const now = new Date();
    return now.toLocaleString();
  };
  
  // Table columns
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'rollNumber', header: 'Roll Number' },
    { key: 'email', header: 'Email' },
    { 
      key: 'enrollments', 
      header: 'Enrolled Courses',
      cell: (student: Student) => (
        <div className="space-y-2">
          {student.enrollments.map((enrollment, idx) => (
            <div key={idx} className="text-sm">
              {enrollment.courseTitle}
            </div>
          ))}
        </div>
      )
    },
    {
      key: 'progress',
      header: 'Progress',
      cell: (student: Student) => (
        <div className="space-y-3 min-w-[150px]">
          {student.enrollments.map((enrollment, idx) => (
            <div key={idx}>
              <div className="text-xs mb-1">{enrollment.courseTitle}</div>
              <ProgressBadge value={enrollment.progress} />
            </div>
          ))}
        </div>
      )
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">
            View and manage student details and course progress.
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Student Details</CardTitle>
            <CardDescription>
              Total Students: {isLoading ? '...' : students.length}
            </CardDescription>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            Last updated: {getActivityTimestamp()}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full sm:w-auto mb-4 grid sm:inline-flex grid-cols-3">
              <TabsTrigger value="all">All Students</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2">Loading student data...</span>
                </div>
              ) : (
                <DataTable 
                  data={students}
                  columns={columns}
                  searchKeys={['name', 'rollNumber', 'email']}
                  itemsPerPage={10}
                  emptyMessage="No students found."
                  exportOptions={{
                    filename: "student-details",
                    enableCSV: true,
                    enablePDF: true,
                    enableWord: true
                  }}
                />
              )}
            </TabsContent>
            
            <TabsContent value="active">
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Active Students View</h3>
                <p className="text-muted-foreground mt-2 mb-6 max-w-md">
                  This view would show only active students.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="inactive">
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Inactive Students View</h3>
                <p className="text-muted-foreground mt-2 mb-6 max-w-md">
                  This view would show only inactive students.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetailsPage;
