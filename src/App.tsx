
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ReactNode, useEffect } from "react";

// Pages
import LoginPage from "./pages/LoginPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import StudentSignupPage from "./pages/StudentSignupPage";
import StaffSignupPage from "./pages/StaffSignupPage";
import AdminSignupPage from "./pages/AdminSignupPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import NotFound from "./pages/NotFound";

// Staff Pages
import StudentDetailsPage from "./pages/staff/StudentDetailsPage";

// Admin Pages
import UserManagementPage from "./pages/admin/UserManagementPage";
import StudentManagementPage from "./pages/admin/StudentManagementPage";
import StaffManagementPage from "./pages/admin/StaffManagementPage";
import ActivityLogsPage from "./pages/admin/ActivityLogsPage";
import SettingsPage from "./pages/admin/SettingsPage";

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

// Role-based route guard
const RoleRoute = ({ children, allowedRoles }: { children: ReactNode, allowedRoles: string[] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, isAuthenticated, loading } = useAuth();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/admin-login" element={!isAuthenticated ? <AdminLoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/role-selection" element={!isAuthenticated ? <RoleSelectionPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/signup-student" element={!isAuthenticated ? <StudentSignupPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/signup-staff" element={!isAuthenticated ? <StaffSignupPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/signup-admin-7x9p3q8r2t" element={!isAuthenticated ? <AdminSignupPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        
        {/* Staff Routes */}
        <Route path="/staff/students" element={
          <RoleRoute allowedRoles={['staff', 'admin']}>
            <StudentDetailsPage />
          </RoleRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/users" element={
          <RoleRoute allowedRoles={['admin']}>
            <UserManagementPage />
          </RoleRoute>
        } />
        <Route path="/admin/students" element={
          <RoleRoute allowedRoles={['admin']}>
            <StudentManagementPage />
          </RoleRoute>
        } />
        <Route path="/admin/staff" element={
          <RoleRoute allowedRoles={['admin']}>
            <StaffManagementPage />
          </RoleRoute>
        } />
        <Route path="/admin/activity-logs" element={
          <RoleRoute allowedRoles={['admin']}>
            <ActivityLogsPage />
          </RoleRoute>
        } />
        <Route path="/admin/settings" element={
          <RoleRoute allowedRoles={['admin']}>
            <SettingsPage />
          </RoleRoute>
        } />
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
