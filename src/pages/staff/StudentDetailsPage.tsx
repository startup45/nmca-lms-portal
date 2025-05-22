
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ProgressBadge } from '@/components/ui/progress-badge';
import { Loader2, Plus, FileEdit, BarChart, Trash2, BookEdit, FileText, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { CourseContentUploadModal, CourseContentData } from '@/components/staff/CourseContentUploadModal';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

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

// Course form interface
interface CourseFormData {
  title: string;
  description: string;
  instructor: string;
  totalModules: number;
}

const StudentDetailsPage: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  
  // Course management states
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const [courseFormData, setCourseFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    instructor: '',
    totalModules: 1
  });
  
  // Delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  
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
  
  const handleUploadContent = (data: CourseContentData) => {
    console.log('Uploading content:', data);
    // In a real app, we would send this to the backend
    toast.success('Content uploaded successfully!');
    setIsUploadModalOpen(false);
  };
  
  // Course form handlers
  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseFormData({
      ...courseFormData,
      [name]: name === 'totalModules' ? parseInt(value) || 1 : value
    });
  };
  
  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode && courseToEdit) {
      // Update existing course
      toast.success(`Course "${courseFormData.title}" updated successfully`);
    } else {
      // Create new course
      toast.success(`Course "${courseFormData.title}" created successfully`);
    }
    
    resetCourseForm();
    setIsCourseModalOpen(false);
  };
  
  const openCourseModal = (course?: Course) => {
    if (course) {
      // Edit mode
      setIsEditMode(true);
      setCourseToEdit(course);
      setCourseFormData({
        title: course.title,
        description: 'Course description here',
        instructor: 'Dr. Jane Smith',
        totalModules: 10
      });
    } else {
      // Create mode
      setIsEditMode(false);
      setCourseToEdit(null);
      setCourseFormData({
        title: '',
        description: '',
        instructor: user?.name || '',
        totalModules: 1
      });
    }
    setIsCourseModalOpen(true);
  };
  
  const resetCourseForm = () => {
    setCourseFormData({
      title: '',
      description: '',
      instructor: '',
      totalModules: 1
    });
    setIsEditMode(false);
    setCourseToEdit(null);
  };
  
  // Delete handlers
  const openDeleteDialog = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteCourse = () => {
    if (courseToDelete) {
      // In a real app, we would delete from Supabase
      toast.success(`Course "${courseToDelete.title}" deleted successfully`);
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
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
            <div key={idx} className="text-sm flex items-center justify-between">
              <span>{enrollment.courseTitle}</span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  setSelectedCourseId(enrollment.courseId);
                  setIsUploadModalOpen(true);
                }}
                className="ml-2 h-8"
              >
                <FileText size={14} className="mr-1" />
                Add Content
              </Button>
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
              <div className="text-xs mb-1 flex justify-between">
                <span>{enrollment.courseTitle}</span>
                <span className="font-medium">{enrollment.progress}%</span>
              </div>
              <ProgressBadge value={enrollment.progress} />
            </div>
          ))}
          {student.enrollments.length === 0 && (
            <span className="text-sm text-muted-foreground">No progress data</span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (student: Student) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileEdit size={16} className="mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <BarChart size={16} className="mr-1" />
            Analytics
          </Button>
        </div>
      )
    }
  ];

  // Course performance summary data
  const coursePerformance = [
    { id: 1, title: 'Financial Auditing 101', studentCount: 32, averageProgress: 75 },
    { id: 2, title: 'Corporate Accounting', studentCount: 28, averageProgress: 62 },
    { id: 3, title: 'Tax Auditing Principles', studentCount: 35, averageProgress: 48 },
    { id: 4, title: 'Advanced Auditing Standards', studentCount: 24, averageProgress: 85 },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Details</h1>
          <p className="text-muted-foreground">
            View student information and academic progress.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => openCourseModal()}>
            <Plus size={16} className="mr-1" />
            Create Course
          </Button>
        </div>
      </div>

      {/* Course Management Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Course Management</CardTitle>
          <CardDescription>Manage and monitor your courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coursePerformance.map(course => (
              <Card key={course.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{course.title}</CardTitle>
                  <CardDescription>{course.studentCount} students enrolled</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Average Progress</span>
                      <span className="text-sm font-bold">{course.averageProgress}%</span>
                    </div>
                    <Progress
                      value={course.averageProgress}
                      className="h-2"
                      indicatorClassName={course.averageProgress < 30 ? "bg-red-500" : 
                        course.averageProgress < 70 ? "bg-amber-500" : "bg-green-500"}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setIsUploadModalOpen(true);
                    }}
                  >
                    <Plus size={14} className="mr-1" />
                    Content
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => openCourseModal(course)}
                  >
                    <BookEdit size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => openDeleteDialog(course)}
                  >
                    <Trash2 size={14} className="mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Students List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Students List</CardTitle>
            <CardDescription>
              Total Students: {isLoading ? '...' : students.length}
            </CardDescription>
          </div>
          <Button>
            <Plus size={16} className="mr-1" />
            Add Student
          </Button>
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

      {/* Upload Modal */}
      <CourseContentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadContent}
      />

      {/* Create/Edit Course Modal */}
      <Dialog open={isCourseModalOpen} onOpenChange={setIsCourseModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Course' : 'Create New Course'}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Update the course details' 
                : 'Add a new course to your teaching portfolio'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCourseSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={courseFormData.title}
                  onChange={handleCourseChange}
                  placeholder="e.g. Advanced Financial Accounting"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Course Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={courseFormData.description}
                  onChange={handleCourseChange}
                  placeholder="Describe the course content and objectives"
                  className="min-h-[100px]"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  name="instructor"
                  value={courseFormData.instructor}
                  onChange={handleCourseChange}
                  placeholder="e.g. Dr. Jane Smith"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="totalModules">Number of Modules</Label>
                <Input
                  id="totalModules"
                  name="totalModules"
                  type="number"
                  min="1"
                  value={courseFormData.totalModules}
                  onChange={handleCourseChange}
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCourseModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditMode ? 'Save Changes' : 'Create Course'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-3">
            <p className="text-sm text-red-600">
              This will remove all course content and student enrollments for this course.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCourse}>
              Delete Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDetailsPage;
