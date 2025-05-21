
import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
import { Slider } from '@/components/ui/slider';
import { 
  CheckCircle2, 
  Circle, 
  Play, 
  FileText, 
  Download, 
  ExternalLink,
  Maximize,
  Minimize,
  Users,
  Lock,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { supabase, updateModuleCompletion, fetchUserCourseProgress } from '@/integrations/supabase/client';

// Mock course data - In a real app, this would come from the database
const courseData = {
  id: 1,
  title: 'Financial Auditing 101',
  description: 'Introduction to financial auditing principles and practices.',
  instructor: 'Dr. Jane Smith',
  thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmluYW5jaWFsJTIwYXVkaXRpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
  totalModules: 8,
  completedModules: 0,
  progress: 0,
  enrolledStudents: 42,
  modules: [
    {
      id: 1,
      title: 'Introduction to Financial Auditing',
      description: 'Overview of the course and introduction to basic concepts.',
      completed: false,
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
      completed: false,
      contentType: 'video',
      duration: '53:15',
      videoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw', // Different video
      resources: [
        { id: 3, title: 'Auditing Standards PDF', type: 'pdf', url: '#' },
        { id: 4, title: 'Case Study: XYZ Corp', type: 'pdf', url: '#' },
      ]
    },
    {
      id: 3,
      title: 'Risk Assessment in Auditing',
      description: 'Identifying and evaluating audit risks.',
      completed: false,
      contentType: 'video',
      duration: '48:30',
      videoUrl: 'https://www.youtube.com/embed/LXb3EKWsInQ', // Different video
      resources: [
        { id: 5, title: 'Risk Assessment Worksheet', type: 'excel', url: '#' },
      ]
    },
    {
      id: 4,
      title: 'Internal Controls Evaluation',
      description: 'Techniques for evaluating internal controls.',
      completed: false,
      contentType: 'video',
      duration: '51:45',
      videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0', // Different video
      resources: [
        { id: 6, title: 'Internal Controls Checklist', type: 'pdf', url: '#' },
        { id: 7, title: 'Control Environment Analysis', type: 'pdf', url: '#' },
      ]
    },
    {
      id: 5,
      title: 'Substantive Procedures',
      description: 'Designing and performing substantive audit procedures.',
      completed: false,
      contentType: 'video',
      duration: '59:10',
      videoUrl: 'https://www.youtube.com/embed/mQvteoFiMlg', // Different video
      resources: [
        { id: 8, title: 'Audit Procedures Guide', type: 'pdf', url: '#' },
      ]
    },
    {
      id: 6,
      title: 'Audit Documentation',
      description: 'Best practices for preparing audit documentation.',
      completed: false,
      contentType: 'video',
      duration: '42:55',
      videoUrl: 'https://www.youtube.com/embed/Kzcz-EVKBEQ', // Different video
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
      videoUrl: 'https://www.youtube.com/embed/uhAGJSAuNjI', // Different video
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
      videoUrl: 'https://www.youtube.com/embed/GXrDYboUnnw', // Different video
      resources: [
        { id: 11, title: 'Specialized Audit Guide', type: 'pdf', url: '#' },
      ]
    },
  ],
};

const CourseDetailPage = () => {
  const { user } = useAuth();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('content');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [courseProgress, setCourseProgress] = useState<number>(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [course, setCourse] = useState(courseData);
  const [selectedModule, setSelectedModule] = useState(course.modules[0]);
  const [isVideoAccessible, setIsVideoAccessible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);

  // Load user's course progress
  useEffect(() => {
    if (user?.id) {
      const loadProgress = async () => {
        setIsLoading(true);
        
        try {
          const progress = await fetchUserCourseProgress(user.id, Number(courseId));
          
          if (progress) {
            const completedIds = progress.completed_modules || [];
            setCompletedModules(completedIds);
            setCourseProgress(progress.progress_percentage || 0);
            
            // Update course data with loaded progress
            const updatedCourse = {
              ...course,
              completedModules: completedIds.length,
              progress: progress.progress_percentage || 0,
              modules: course.modules.map(module => ({
                ...module,
                completed: completedIds.includes(module.id)
              }))
            };
            
            setCourse(updatedCourse);
            
            // If they have a last accessed module, select it
            if (progress.last_accessed_module) {
              const lastModule = updatedCourse.modules.find(m => m.id === progress.last_accessed_module);
              if (lastModule) {
                setSelectedModule(lastModule);
              }
            }
          }
        } catch (error) {
          console.error("Error loading progress:", error);
          toast.error("Failed to load your progress");
        } finally {
          setIsLoading(false);
        }
      };
      
      loadProgress();
    }
  }, [user?.id, courseId]);

  // Check if the selected module is accessible based on course progress
  useEffect(() => {
    // Always allow first module
    if (selectedModule.id === 1) {
      setIsVideoAccessible(true);
      return;
    }
    
    // Staff and admin can access all videos
    if (user?.role === 'staff' || user?.role === 'admin') {
      setIsVideoAccessible(true);
      return;
    }
    
    // For students: Check if the previous module is completed
    if (user?.role === 'student') {
      const previousModuleId = selectedModule.id - 1;
      const isPreviousModuleCompleted = completedModules.includes(previousModuleId);
      
      setIsVideoAccessible(isPreviousModuleCompleted);
      
      if (!isPreviousModuleCompleted && selectedModule.id > 1) {
        toast.warning(`Complete the previous module first to unlock this content.`);
      }
    }
  }, [selectedModule.id, completedModules, user?.role]);
  
  // Function to toggle module completion status
  const toggleModuleCompletion = async (moduleId: number) => {
    if (!user?.id) {
      toast.error("Please sign in to track your progress");
      return;
    }
    
    const newCompletionState = !selectedModule.completed;
    
    // Optimistic UI update
    const updatedModules = course.modules.map(module => 
      module.id === moduleId 
        ? { ...module, completed: newCompletionState } 
        : module
    );
    
    const updatedCompletedModules = newCompletionState
      ? [...completedModules, moduleId]
      : completedModules.filter(id => id !== moduleId);
      
    const newProgressPercentage = (updatedCompletedModules.length / course.totalModules) * 100;
    
    setCourse({
      ...course,
      modules: updatedModules,
      completedModules: updatedCompletedModules.length,
      progress: newProgressPercentage
    });
    
    setCompletedModules(updatedCompletedModules);
    setCourseProgress(newProgressPercentage);
    
    // Update in database
    const success = await updateModuleCompletion(
      user.id,
      Number(courseId),
      moduleId,
      newCompletionState
    );
    
    if (success) {
      toast.success(`Module marked as ${newCompletionState ? 'complete' : 'incomplete'}`);
      
      // If they completed this module, check if the next one exists and remind them it's now unlocked
      if (newCompletionState) {
        const nextModuleId = moduleId + 1;
        const nextModule = course.modules.find(m => m.id === nextModuleId);
        
        if (nextModule) {
          toast.success(`Next module "${nextModule.title}" is now unlocked!`);
        }
      }
    } else {
      toast.error("Failed to update progress");
      
      // Revert UI changes on error
      setCourse({
        ...course,
        modules: course.modules,
        completedModules: completedModules.length,
        progress: (completedModules.length / course.totalModules) * 100
      });
      setCompletedModules(completedModules);
      setCourseProgress((completedModules.length / course.totalModules) * 100);
    }
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

  // Simulate video progress for demo purposes
  useEffect(() => {
    if (!isVideoAccessible) return;
    
    const timer = setInterval(() => {
      setVideoProgress(prev => {
        const newValue = prev + 1;
        if (newValue >= 100) {
          clearInterval(timer);
          
          // Auto-mark complete when video finishes
          if (user?.role === 'student' && !selectedModule.completed) {
            toggleModuleCompletion(selectedModule.id);
          }
          
          return 100;
        }
        return newValue;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [selectedModule.id, isVideoAccessible]);
  
  // Reset video progress when changing modules
  useEffect(() => {
    setVideoProgress(0);
  }, [selectedModule.id]);

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
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">Instructor: {course.instructor}</p>
        </div>
        
        {user?.role === 'student' && (
          <div className="flex items-center gap-2">
            <div>
              <div className="text-sm font-medium mb-1">
                Course Progress: {Math.round(courseProgress)}%
              </div>
              <Progress value={courseProgress} className="h-2 w-[200px]" />
            </div>
          </div>
        )}
        
        {(user?.role === 'staff' || user?.role === 'admin') && (
          <Button>
            <Users className="mr-2 h-4 w-4" />
            {course.enrolledStudents} Enrolled
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
                {course.completedModules} of {course.totalModules} modules completed
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y">
                {course.modules.map((module) => {
                  const previousModuleCompleted = module.id === 1 || completedModules.includes(module.id - 1);
                  const isLocked = user?.role === 'student' && !previousModuleCompleted && module.id !== 1;
                  
                  return (
                    <li key={module.id}>
                      <button
                        onClick={() => setSelectedModule(module)}
                        disabled={isLocked}
                        className={cn(
                          "flex items-start w-full p-4 text-left transition-colors hover:bg-muted",
                          selectedModule.id === module.id && "bg-muted",
                          isLocked && "opacity-60 cursor-not-allowed"
                        )}
                      >
                        <div className="mr-3 mt-0.5">
                          {module.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : isLocked ? (
                            <Lock className="h-5 w-5 text-muted-foreground" />
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
                        {isLocked && user?.role === 'student' && (
                          <Badge variant="outline" className="ml-auto">Locked</Badge>
                        )}
                      </button>
                    </li>
                  );
                })}
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
              {isVideoAccessible ? (
                <>
                  <iframe
                    src={selectedModule.videoUrl}
                    title={selectedModule.title}
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                  
                  {!isFullscreen && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between text-white text-xs">
                          <span>Video Progress</span>
                          <span>{videoProgress}%</span>
                        </div>
                        <Progress value={videoProgress} className="h-1" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white">
                  <Lock className="h-16 w-16 mb-4" />
                  <h3 className="text-xl font-bold">Content Locked</h3>
                  <p className="text-center max-w-md mt-2">
                    Complete the previous module first to unlock this content.
                  </p>
                  <Button 
                    className="mt-4"
                    variant="outline"
                    onClick={() => {
                      const previousModule = course.modules.find(m => m.id === selectedModule.id - 1);
                      if (previousModule) setSelectedModule(previousModule);
                    }}
                  >
                    Go to Previous Module
                  </Button>
                </div>
              )}
              
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
                  disabled={!isVideoAccessible}
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
