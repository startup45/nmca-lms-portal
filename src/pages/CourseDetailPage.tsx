
import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Circle, 
  Play, 
  FileText, 
  Download, 
  ExternalLink,
  Maximize,
  Minimize,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from "sonner";

// Mock course data
const courseData = {
  id: 1,
  title: 'Financial Auditing 101',
  description: 'Introduction to financial auditing principles and practices.',
  instructor: 'Dr. Jane Smith',
  thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmluYW5jaWFsJTIwYXVkaXRpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
  totalModules: 8,
  completedModules: 6,
  progress: 75,
  enrolledStudents: 42,
  modules: [
    {
      id: 1,
      title: 'Introduction to Financial Auditing',
      description: 'Overview of the course and introduction to basic concepts.',
      completed: true,
      contentType: 'video',
      duration: '45:20',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder URL
      resources: [
        { id: 1, title: 'Course Syllabus', type: 'pdf', url: '#' },
        { id: 2, title: 'Introduction Slides', type: 'pdf', url: '#' },
      ]
    },
    {
      id: 2,
      title: 'Auditing Standards and Frameworks',
      description: 'Learn about international and local auditing standards.',
      completed: true,
      contentType: 'video',
      duration: '53:15',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder URL
      resources: [
        { id: 3, title: 'Auditing Standards PDF', type: 'pdf', url: '#' },
        { id: 4, title: 'Case Study: XYZ Corp', type: 'pdf', url: '#' },
      ]
    },
    {
      id: 3,
      title: 'Risk Assessment in Auditing',
      description: 'Identifying and evaluating audit risks.',
      completed: true,
      contentType: 'video',
      duration: '48:30',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder URL
      resources: [
        { id: 5, title: 'Risk Assessment Worksheet', type: 'excel', url: '#' },
      ]
    },
    {
      id: 4,
      title: 'Internal Controls Evaluation',
      description: 'Techniques for evaluating internal controls.',
      completed: true,
      contentType: 'video',
      duration: '51:45',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder URL
      resources: [
        { id: 6, title: 'Internal Controls Checklist', type: 'pdf', url: '#' },
        { id: 7, title: 'Control Environment Analysis', type: 'pdf', url: '#' },
      ]
    },
    {
      id: 5,
      title: 'Substantive Procedures',
      description: 'Designing and performing substantive audit procedures.',
      completed: true,
      contentType: 'video',
      duration: '59:10',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder URL
      resources: [
        { id: 8, title: 'Audit Procedures Guide', type: 'pdf', url: '#' },
      ]
    },
    {
      id: 6,
      title: 'Audit Documentation',
      description: 'Best practices for preparing audit documentation.',
      completed: true,
      contentType: 'video',
      duration: '42:55',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder URL
      resources: [
        { id: 9, title: 'Documentation Templates', type: 'zip', url: '#' },
      ]
    },
    {
      id: 7,
      title: 'Audit Opinions',
      description: 'Types of audit opinions and when to issue them.',
      completed: false,
      contentType: 'video',
      duration: '47:20',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder URL
      resources: [
        { id: 10, title: 'Opinion Examples', type: 'pdf', url: '#' },
      ]
    },
    {
      id: 8,
      title: 'Specialized Audits',
      description: 'Introduction to specialized audit engagements.',
      completed: false,
      contentType: 'video',
      duration: '56:40',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder URL
      resources: [
        { id: 11, title: 'Specialized Audit Guide', type: 'pdf', url: '#' },
      ]
    },
  ],
};

const CourseDetailPage = () => {
  const { user } = useAuth();
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState('content');
  const [selectedModule, setSelectedModule] = useState(courseData.modules[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  
  // Function to toggle module completion status
  const toggleModuleCompletion = (moduleId: number) => {
    // In a real app, this would update the backend
    toast.success(`Module marked as ${selectedModule.completed ? 'incomplete' : 'complete'}`);
    
    // Update local state for demo purposes
    setSelectedModule({
      ...selectedModule,
      completed: !selectedModule.completed
    });
  };
  
  // Function to toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(err => {
        toast.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  // Listen for fullscreen change events
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className={cn(
      "flex flex-col",
      isFullscreen && "fixed inset-0 z-50 bg-background p-0"
    )}>
      <div className={cn(
        "mb-6 flex flex-wrap items-start justify-between gap-4",
        isFullscreen && "hidden"
      )}>
        <div>
          <h1 className="text-3xl font-bold">{courseData.title}</h1>
          <p className="text-muted-foreground">Instructor: {courseData.instructor}</p>
        </div>
        
        {user?.role === 'student' && (
          <div className="flex items-center gap-2">
            <div>
              <div className="text-sm font-medium mb-1">
                Course Progress: {courseData.progress}%
              </div>
              <Progress value={courseData.progress} className="h-2 w-[200px]" />
            </div>
          </div>
        )}
        
        {(user?.role === 'staff' || user?.role === 'admin') && (
          <Button>
            <Users className="mr-2 h-4 w-4" />
            {courseData.enrolledStudents} Enrolled
          </Button>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Sidebar with modules listing */}
        <div className={cn(
          "md:col-span-1 order-2 md:order-1",
          isFullscreen && "hidden"
        )}>
          <Card>
            <CardHeader>
              <CardTitle>Course Modules</CardTitle>
              <CardDescription>
                {courseData.completedModules} of {courseData.totalModules} modules completed
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y">
                {courseData.modules.map((module) => (
                  <li key={module.id}>
                    <button
                      onClick={() => setSelectedModule(module)}
                      className={cn(
                        "flex items-start w-full p-4 text-left transition-colors hover:bg-muted",
                        selectedModule.id === module.id && "bg-muted"
                      )}
                    >
                      <div className="mr-3 mt-0.5">
                        {module.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{module.title}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Play className="h-3 w-3 mr-1" />
                          <span>{module.duration}</span>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content area with video and tabs */}
        <div className={cn(
          "md:col-span-2 order-1 md:order-2",
          isFullscreen && "w-full h-full"
        )}>
          {/* Video container with controls */}
          <div 
            ref={videoContainerRef} 
            className={cn(
              "bg-black rounded-lg overflow-hidden w-full mb-6",
              isFullscreen ? "h-full" : "aspect-video"
            )}
          >
            <div className="relative h-full">
              <iframe
                src={selectedModule.videoUrl}
                title={selectedModule.title}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
              
              <div className="absolute top-2 right-2 p-2">
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize className="h-5 w-5" />
                  ) : (
                    <Maximize className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Content tabs below video */}
          <div className={cn(
            "space-y-4",
            isFullscreen && "hidden"
          )}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedModule.title}</h2>
                <p className="text-muted-foreground">{selectedModule.description}</p>
              </div>
              
              {user?.role === 'student' && (
                <Button
                  onClick={() => toggleModuleCompletion(selectedModule.id)}
                  variant={selectedModule.completed ? "outline" : "default"}
                  className={selectedModule.completed ? "" : "bg-green-600 hover:bg-green-700"}
                >
                  {selectedModule.completed ? (
                    <>
                      <Circle className="mr-2 h-4 w-4" />
                      Mark as Incomplete
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark as Complete
                    </>
                  )}
                </Button>
              )}
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4 pt-4">
                <div>
                  <h3 className="text-lg font-medium">About this lesson</h3>
                  <p className="text-muted-foreground mt-2">
                    {selectedModule.description} This lesson covers the fundamental principles and methodologies of financial auditing. 
                    You will learn about the importance of auditing in financial reporting, the role of auditors, and the basic procedures 
                    followed during an audit engagement.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Learning Objectives</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Understand the fundamental concepts of financial auditing</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Identify the role of auditors in the financial reporting process</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Recognize key auditing standards and frameworks</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Apply basic audit procedures in practical scenarios</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="resources" className="pt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Course Materials</h3>
                  
                  {selectedModule.resources.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedModule.resources.map((resource) => (
                        <li key={resource.id}>
                          <Link 
                            to={resource.url}
                            className="flex items-center p-3 rounded-md border hover:bg-muted transition-colors"
                          >
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center mr-3">
                              <FileText className="h-5 w-5 text-nmca-blue" />
                            </div>
                            <div>
                              <p className="font-medium">{resource.title}</p>
                              <p className="text-xs text-muted-foreground uppercase">{resource.type} document</p>
                            </div>
                            <Download className="h-4 w-4 ml-auto text-muted-foreground" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No resources available for this module.</p>
                  )}
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium">Additional Resources</h3>
                    <ul className="mt-2 space-y-2">
                      <li>
                        <a 
                          href="https://www.iaasb.org/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-nmca-blue hover:underline"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          International Auditing and Assurance Standards Board (IAASB)
                        </a>
                      </li>
                      <li>
                        <a 
                          href="https://www.ifac.org/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-nmca-blue hover:underline"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          International Federation of Accountants (IFAC)
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
