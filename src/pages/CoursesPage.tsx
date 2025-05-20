
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Book, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Mock course data - In a real application, this would come from Supabase
const coursesData = [
  {
    id: 1,
    title: 'Financial Auditing 101',
    description: 'Introduction to financial auditing principles and practices.',
    instructor: 'Dr. Jane Smith',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmluYW5jaWFsJTIwYXVkaXRpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    progress: 75,
    duration: '8 hours',
    totalModules: 8,
    enrolledStudents: 42,
  },
  {
    id: 2,
    title: 'Corporate Accounting',
    description: 'Comprehensive overview of corporate accounting practices and regulations.',
    instructor: 'Prof. Robert Johnson',
    thumbnail: 'https://images.unsplash.com/photo-1491336477066-31156b5e4f35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFjY291bnRpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    progress: 40,
    duration: '12 hours',
    totalModules: 12,
    enrolledStudents: 38,
  },
  {
    id: 3,
    title: 'Tax Auditing Principles',
    description: 'Learn about tax auditing procedures and compliance requirements.',
    instructor: 'Dr. Michael Chen',
    thumbnail: 'https://images.unsplash.com/photo-1586486855514-8c257a8a193f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGF4fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    progress: 10,
    duration: '10 hours',
    totalModules: 10,
    enrolledStudents: 27,
  },
];

const CoursesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState(coursesData);
  
  const handleCourseClick = (courseId: number) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {user?.role === 'student' ? 'My Courses' : 'All Courses'}
        </h1>
        
        {(user?.role === 'staff' || user?.role === 'admin') && (
          <Button className="bg-nmca-blue hover:bg-blue-700">
            Add New Course
          </Button>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleCourseClick(course.id)}>
            <div className="aspect-video w-full overflow-hidden">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              <CardDescription>Instructor: {course.instructor}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
              
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center">
                  <Book className="mr-1 h-4 w-4" />
                  <span>{course.totalModules} modules</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
              </div>
              
              {user?.role === 'student' && (
                <>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </>
              )}
              
              {(user?.role === 'staff' || user?.role === 'admin') && (
                <Badge className="mt-2">
                  {course.enrolledStudents} Students Enrolled
                </Badge>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Button className="w-full bg-nmca-blue hover:bg-blue-700">
                <Play className="mr-2 h-4 w-4" />
                {user?.role === 'student' 
                  ? course.progress > 0 ? 'Continue Learning' : 'Start Course' 
                  : 'View Course'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {courses.length === 0 && (
        <div className="text-center p-12 border rounded-lg">
          <p className="text-xl text-muted-foreground">No courses available.</p>
          {user?.role === 'student' && (
            <p className="mt-2">Enroll in courses to start learning!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
