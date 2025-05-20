
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Plus, Video, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock course data
const mockCourses = [
  {
    id: 1,
    title: 'Financial Auditing 101',
    description: 'Introduction to financial auditing principles and practices.',
    instructor: 'Dr. Jane Smith',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmluYW5jaWFsJTIwYXVkaXRpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    modules: 8,
    progress: 75,
    enrolledStudents: 42,
  },
  {
    id: 2,
    title: 'Corporate Accounting',
    description: 'Advanced accounting principles for corporate environments.',
    instructor: 'Prof. Robert Johnson',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWNjb3VudGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    modules: 12,
    progress: 30,
    enrolledStudents: 37,
  },
  {
    id: 3,
    title: 'Tax Auditing Principles',
    description: 'Learn the fundamental principles of tax auditing and compliance.',
    instructor: 'Prof. Michael Brown',
    thumbnail: 'https://images.unsplash.com/photo-1586486855514-8c633cc8584b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dGF4fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    modules: 10,
    progress: 45,
    enrolledStudents: 28,
  },
  {
    id: 4,
    title: 'Risk Assessment in Auditing',
    description: 'Strategic approaches to risk assessment in the auditing process.',
    instructor: 'Dr. Sarah Williams',
    thumbnail: 'https://images.unsplash.com/photo-1633158829875-e5316a358c6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmlza3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    modules: 6,
    progress: 10,
    enrolledStudents: 31,
  },
];

const CoursesPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter courses based on search term
  const filteredCourses = mockCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {user?.role === 'admin' ? 'All Courses' : 'My Courses'}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'staff' 
              ? 'Manage and create your courses' 
              : user?.role === 'admin'
              ? 'Manage all courses on the platform'
              : 'Access your enrolled courses'}
          </p>
        </div>
        
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {(user?.role === 'staff' || user?.role === 'admin') && (
            <Button className="bg-nmca-blue hover:bg-nmca-darkBlue">
              <Plus className="mr-2 h-4 w-4" /> New Course
            </Button>
          )}
        </div>
      </div>
      
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No courses found</h3>
          <p className="text-muted-foreground">
            {searchTerm 
              ? "Try adjusting your search terms" 
              : user?.role === 'student'
              ? "You are not enrolled in any courses yet"
              : "You haven't created any courses yet"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Link to={`/courses/${course.id}`} key={course.id} className="transition-all hover:scale-[1.01]">
              <Card className="h-full overflow-hidden">
                <div className="h-40 overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.instructor}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center">
                      <Video className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{course.modules} modules</span>
                    </div>
                    
                    {user?.role === 'staff' || user?.role === 'admin' ? (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{course.enrolledStudents} students</span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        In Progress
                      </Badge>
                    )}
                  </div>
                  
                  {user?.role === 'student' && (
                    <div className="mt-4">
                      <div className="flex justify-between mb-1 text-xs">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-nmca-blue" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full">
                    {user?.role === 'student' ? 'Continue Learning' : 'Manage Course'}
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
