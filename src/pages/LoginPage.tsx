
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
import { useAuth, LoginCredentials, SignupData } from '@/contexts/AuthContext';

// Form validation schema for login
const loginSchema = z.object({
  identifier: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['student', 'staff', 'admin']),
});

// Form validation schema for signup
const signupSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  identifier: z.string().min(1, 'Required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  role: z.enum(['student', 'staff', 'admin']),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

const LoginPage = () => {
  const { login, signup, isAuthenticated, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  const loginForm = useForm<LoginCredentials & { role: 'student' | 'staff' | 'admin' }>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      role: 'student',
    },
  });

  const signupForm = useForm<SignupData & { confirmPassword: string, role: 'student' | 'staff' | 'admin' }>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      identifier: '',
      password: '',
      confirmPassword: '',
      email: 'user@gmail.com', // Default to gmail.com
      role: 'student',
    },
  });

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (data: LoginCredentials & { role: 'student' | 'staff' | 'admin' }) => {
    const { role, ...credentials } = data;
    await login(credentials, role);
    loginForm.reset();
  };

  const handleSignup = async (data: SignupData & { confirmPassword: string, role: 'student' | 'staff' | 'admin' }) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, role, ...userData } = data;
    
    // For now, always use gmail.com for the email
    const email = userData.identifier.includes('@') 
      ? userData.identifier 
      : `${userData.identifier}@gmail.com`;
    
    await signup({ ...userData, email }, role);
    signupForm.reset();
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
              <CardTitle>{mode === 'login' ? 'Sign In' : 'Create Account'}</CardTitle>
              <CardDescription>
                {mode === 'login' 
                  ? 'Enter your credentials to access your account'
                  : 'Fill in the details below to create a new account'}
              </CardDescription>
            </CardHeader>

            {mode === 'login' ? (
              <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>I am a:</Label>
                    <RadioGroup 
                      className="flex flex-col space-y-1"
                      value={loginForm.watch('role')}
                      onValueChange={(value) => loginForm.setValue('role', value as 'student' | 'staff' | 'admin')}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="student" id="student-login" />
                        <Label htmlFor="student-login">Student</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="staff" id="staff-login" />
                        <Label htmlFor="staff-login">Staff</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="admin" id="admin-login" />
                        <Label htmlFor="admin-login">Administrator</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="identifier">
                      {loginForm.watch('role') === 'student' ? 'Roll Number or Email' : 
                       loginForm.watch('role') === 'staff' ? 'Staff ID or Email' : 'Email'}
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
                  
                  <p className="text-sm text-center">
                    Don't have an account?{' '}
                    <button 
                      type="button"
                      onClick={() => setMode('signup')} 
                      className="text-nmca-blue hover:underline"
                    >
                      Create Account
                    </button>
                  </p>
                </CardFooter>
              </form>
            ) : (
              <form onSubmit={signupForm.handleSubmit(handleSignup)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>I want to register as a:</Label>
                    <RadioGroup 
                      className="flex flex-col space-y-1"
                      value={signupForm.watch('role')}
                      onValueChange={(value) => signupForm.setValue('role', value as 'student' | 'staff' | 'admin')}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="student" id="student-signup" />
                        <Label htmlFor="student-signup">Student</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="staff" id="staff-signup" />
                        <Label htmlFor="staff-signup">Staff</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="admin" id="admin-signup" />
                        <Label htmlFor="admin-signup">Administrator</Label>
                      </div>
                    </RadioGroup>
                  </div>

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
                      {signupForm.watch('role') === 'student' ? 'Roll Number or Email' : 
                       signupForm.watch('role') === 'staff' ? 'Staff ID or Email' : 'Email'}
                    </Label>
                    <Input
                      id="signup-identifier"
                      placeholder="Enter your ID or email"
                      {...signupForm.register('identifier')}
                      className={signupForm.formState.errors.identifier ? 'border-red-500' : ''}
                    />
                    {signupForm.formState.errors.identifier && (
                      <p className="text-red-500 text-xs mt-1">{signupForm.formState.errors.identifier.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {signupForm.watch('role') !== 'admin' ? 
                        "If you don't enter a valid email, we'll use your ID@gmail.com" : 
                        "Please use a valid email address"}
                    </p>
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
                
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-nmca-blue hover:bg-nmca-darkBlue" 
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                  
                  <p className="text-sm text-center">
                    Already have an account?{' '}
                    <button 
                      type="button"
                      onClick={() => setMode('login')} 
                      className="text-nmca-blue hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                </CardFooter>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
