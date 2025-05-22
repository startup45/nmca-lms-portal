
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { ProgressBadge } from '@/components/ui/progress-badge';
import { Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';

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
          {student.enrollments.length === 0 && (
            <span className="text-sm text-muted-foreground">No courses</span>
          )}
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
          {student.enrollments.length === 0 && (
            <span className="text-sm text-muted-foreground">No progress data</span>
          )}
        </div>
      )
    }
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Details</h1>
        <p className="text-muted-foreground">
          View student information and academic progress.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
          <CardDescription>
            Total Students: {isLoading ? '...' : students.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                filename: "students-list",
                enableCSV: true,
                enablePDF: true,
                enableWord: true
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetailsPage;
