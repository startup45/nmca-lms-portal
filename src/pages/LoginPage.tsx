
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useAuth, LoginCredentials, SignupData } from '@/contexts/AuthContext';

// Form validation schema for login
const loginSchema = z.object({
  identifier: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Password is required'),
});

// Form validation schema for signup
const signupSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  identifier: z.string().min(1, 'Required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

const LoginPage = () => {
  const { login, signup, isAuthenticated, loading } = useAuth();
  const [role, setRole] = useState<'student' | 'staff'>('student');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  const loginForm = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const signupForm = useForm<SignupData & { confirmPassword: string }>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      identifier: '',
      password: '',
      confirmPassword: '',
      email: `${Math.random().toString(36).substring(2, 15)}@nmca.edu`, // Dummy email for non-admin users
    },
  });

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (data: LoginCredentials) => {
    await login(data, role);
    loginForm.reset();
  };

  const handleSignup = async (data: SignupData & { confirmPassword: string }) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...userData } = data;
    await signup(userData, role);
    signupForm.reset();
  };

  const handleRoleChange = (value: string) => {
    setRole(value as 'student' | 'staff');
    loginForm.reset();
    signupForm.reset();
  };

  const handleModeChange = (value: string) => {
    setMode(value as 'login' | 'signup');
  };

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <div 
        className="flex-1 bg-cover bg-center hidden sm:block"
        style={{ 
          backgroundImage: `url('https://nmcauditingcollege.com/wp-content/uploads/2019/04/Kiki-PixTeller.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="h-full w-full bg-nmca-blue/50 backdrop-blur-sm flex items-center justify-center">
          <div className="max-w-md text-white p-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to NMCA LMS</h1>
            <p className="text-xl">Your gateway to knowledge and excellence in auditing education.</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <img 
              src="https://nmcauditingcollege.com/wp-content/uploads/2020/06/Logo-PixTeller-1.png" 
              alt="NMC Auditing College Logo" 
              className="h-16 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold">NMCA Learning Portal</h1>
            <p className="text-muted-foreground">Access your courses</p>
          </div>
          
          <Card>
            <CardHeader>
              <Tabs defaultValue="student" onValueChange={handleRoleChange}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="staff">Staff</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <Tabs defaultValue="login" onValueChange={handleModeChange}>
              <div className="px-6 pt-2">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="identifier">
                        {role === 'student' ? 'Roll Number' : 'Staff ID'}
                      </Label>
                      <Input
                        id="identifier"
                        placeholder={role === 'student' ? 'Enter your roll number' : 'Enter your staff ID'}
                        {...loginForm.register('identifier')}
                        className={loginForm.formState.errors.identifier ? 'border-red-500' : ''}
                        autoComplete="username"
                      />
                      {loginForm.formState.errors.identifier && (
                        <p className="text-red-500 text-xs mt-1">{loginForm.formState.errors.identifier.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link to="/forgot-password" className="text-xs text-nmca-blue hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...loginForm.register('password')}
                        className={loginForm.formState.errors.password ? 'border-red-500' : ''}
                        autoComplete="current-password"
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-red-500 text-xs mt-1">{loginForm.formState.errors.password.message}</p>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-nmca-blue hover:bg-nmca-darkBlue" 
                      disabled={loading}
                    >
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={signupForm.handleSubmit(handleSignup)}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        placeholder="Enter your full name"
                        {...signupForm.register('name')}
                        className={signupForm.formState.errors.name ? 'border-red-500' : ''}
                      />
                      {signupForm.formState.errors.name && (
                        <p className="text-red-500 text-xs mt-1">{signupForm.formState.errors.name.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-identifier">
                        {role === 'student' ? 'Roll Number' : 'Staff ID'}
                      </Label>
                      <Input
                        id="signup-identifier"
                        placeholder={role === 'student' ? 'Enter your roll number' : 'Enter your staff ID'}
                        {...signupForm.register('identifier')}
                        className={signupForm.formState.errors.identifier ? 'border-red-500' : ''}
                      />
                      {signupForm.formState.errors.identifier && (
                        <p className="text-red-500 text-xs mt-1">{signupForm.formState.errors.identifier.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        {...signupForm.register('password')}
                        className={signupForm.formState.errors.password ? 'border-red-500' : ''}
                      />
                      {signupForm.formState.errors.password && (
                        <p className="text-red-500 text-xs mt-1">{signupForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        {...signupForm.register('confirmPassword')}
                        className={signupForm.formState.errors.confirmPassword ? 'border-red-500' : ''}
                      />
                      {signupForm.formState.errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{signupForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-nmca-blue hover:bg-nmca-darkBlue" 
                      disabled={loading}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Are you an administrator?{' '}
              <Link to="/admin-login" className="text-nmca-blue hover:underline">
                Admin Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
