
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth, LoginCredentials } from '@/contexts/AuthContext';

// Form validation schema for login
const loginSchema = z.object({
  identifier: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['student', 'staff']),
});

const LoginPage = () => {
  const { login, isAuthenticated, loading } = useAuth();
  
  const loginForm = useForm<LoginCredentials & { role: 'student' | 'staff' }>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      role: 'student',
    },
  });

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (data: LoginCredentials & { role: 'student' | 'staff' }) => {
    const { role, ...credentials } = data;
    await login(credentials, role);
    loginForm.reset();
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
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <form onSubmit={loginForm.handleSubmit(handleLogin)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>I am a:</Label>
                  <RadioGroup 
                    className="flex flex-col space-y-1"
                    value={loginForm.watch('role')}
                    onValueChange={(value) => loginForm.setValue('role', value as 'student' | 'staff')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student-login" />
                      <Label htmlFor="student-login">Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="staff" id="staff-login" />
                      <Label htmlFor="staff-login">Staff</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="identifier">
                    {loginForm.watch('role') === 'student' ? 'Roll Number or Email' : 'Staff ID or Email'}
                  </Label>
                  <Input
                    id="identifier"
                    placeholder="Enter your ID or email"
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
              
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-nmca-blue hover:bg-nmca-darkBlue" 
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
                
                <div className="flex flex-col space-y-4 w-full text-center">
                  <p className="text-sm">
                    Don't have an account?{' '}
                    <Link 
                      to="/role-selection" 
                      className="text-nmca-blue hover:underline"
                    >
                      Create Account
                    </Link>
                  </p>
                  
                  <p className="text-xs text-muted-foreground">
                    Are you an administrator?{' '}
                    <Link 
                      to="/admin-login" 
                      className="text-nmca-blue hover:underline"
                    >
                      Admin Login
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
