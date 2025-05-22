
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { ProgressBadge } from '@/components/ui/progress-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModalForm } from '@/components/ui/modal-form';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Pencil, Plus, Trash2, Users } from 'lucide-react';
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

const StudentManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Load students data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we would fetch from Supabase
        // For now, we'll use mock data
        setTimeout(() => {
          const mockStudents = generateMockStudents(246); // 246 students as requested
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

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Open the create/edit modal
  const openModal = (student?: Student) => {
    if (student) {
      setCurrentStudent(student);
      setFormData({
        name: student.name,
        rollNumber: student.rollNumber,
        email: student.email,
        password: '',
        confirmPassword: ''
      });
    } else {
      setCurrentStudent(null);
      setFormData({
        name: '',
        rollNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    }
    setIsModalOpen(true);
  };
  
  // Open the delete confirmation modal
  const openDeleteModal = (student: Student) => {
    setCurrentStudent(student);
    setIsDeleteModalOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.rollNumber || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!currentStudent && (!formData.password || formData.password !== formData.confirmPassword)) {
      toast.error(formData.password ? "Passwords do not match" : "Password is required");
      return;
    }
    
    // Mock create/update student
    setTimeout(() => {
      if (currentStudent) {
        // Update existing student
        const updatedStudents = students.map(s => 
          s.id === currentStudent.id ? { ...s, name: formData.name, rollNumber: formData.rollNumber, email: formData.email } : s
        );
        setStudents(updatedStudents);
        toast.success(`Student "${formData.name}" updated successfully`);
      } else {
        // Create new student
        const newStudent: Student = {
          id: `student-${Date.now()}`,
          name: formData.name,
          rollNumber: formData.rollNumber,
          email: formData.email,
          enrollments: []
        };
        setStudents([newStudent, ...students]);
        toast.success(`Student "${formData.name}" created successfully`);
      }
      
      // Close modal and reset form
      setIsModalOpen(false);
      setCurrentStudent(null);
    }, 500);
  };
  
  // Handle student deletion
  const handleDelete = () => {
    if (!currentStudent) return;
    
    // Mock delete student
    setTimeout(() => {
      const filteredStudents = students.filter(s => s.id !== currentStudent.id);
      setStudents(filteredStudents);
      toast.success(`Student "${currentStudent.name}" deleted successfully`);
      
      // Close modal and reset state
      setIsDeleteModalOpen(false);
      setCurrentStudent(null);
    }, 500);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">
            View, create, edit and delete student accounts.
          </p>
        </div>
        <Button onClick={() => openModal()} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            Total Students: {isLoading ? '...' : students.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full sm:w-auto mb-4 grid sm:inline-flex grid-cols-2">
              <TabsTrigger value="all">All Students</TabsTrigger>
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
                    filename: "students-list",
                    enableCSV: true,
                    enablePDF: true,
                    enableWord: true
                  }}
                  actions={(student) => (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openModal(student)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openDeleteModal(student)}
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  )}
                />
              )}
            </TabsContent>
            
            <TabsContent value="inactive">
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Inactive Students</h3>
                <p className="text-muted-foreground mt-2 mb-6 max-w-md">
                  This view would show only inactive students.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Create/Edit Student Modal */}
      <ModalForm
        title={currentStudent ? "Edit Student" : "Add New Student"}
        description={currentStudent ? "Update student information" : "Create a new student account"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        submitLabel={currentStudent ? "Save Changes" : "Create Student"}
      >
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="rollNumber">Roll Number</Label>
            <Input
              id="rollNumber"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          {!currentStudent && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!currentStudent}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!currentStudent}
                />
              </div>
            </>
          )}
        </div>
      </ModalForm>
      
      {/* Delete Confirmation Modal */}
      <ModalForm
        title="Delete Student"
        description={`Are you sure you want to delete ${currentStudent?.name}? This action cannot be undone.`}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSubmit={handleDelete}
        submitLabel="Delete"
      >
        <div className="pt-2 pb-4">
          <p className="text-sm font-medium text-destructive">
            This will permanently delete the student account, their enrollment records, and progress data.
          </p>
        </div>
      </ModalForm>
    </div>
  );
};

export default StudentManagementPage;
