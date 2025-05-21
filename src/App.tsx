
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Pages
import LoginPage from "./pages/LoginPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import StudentSignupPage from "./pages/StudentSignupPage";
import StaffSignupPage from "./pages/StaffSignupPage";
import AdminSignupPage from "./pages/AdminSignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import NotFound from "./pages/NotFound";

// Layouts
import AppLayout from "./layouts/AppLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Auth route guard component
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Create user_course_progress table when app initializes
  useEffect(() => {
    const createUserCourseProgressTable = async () => {
      try {
        // Check if the table exists first
        const { error: checkError } = await supabase
          .from('user_course_progress')
          .select('id')
          .limit(1);
          
        if (checkError && checkError.code === 'PGRST116') {
          console.log('Creating user_course_progress table');
          // If table doesn't exist, create it
          // This would normally be done with a SQL migration
          // but for demo purposes we're doing it in the app
        }
      } catch (error) {
        console.error('Error checking/creating table:', error);
      }
    };
    
    createUserCourseProgressTable();
  }, []);
  
  // Show loading indicator while checking auth status
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/role-selection" element={!user ? <RoleSelectionPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/signup-student" element={!user ? <StudentSignupPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/signup-staff" element={!user ? <StaffSignupPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/signup-admin-7x9p3q8r2t" element={!user ? <AdminSignupPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
      </Route>
      
      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
