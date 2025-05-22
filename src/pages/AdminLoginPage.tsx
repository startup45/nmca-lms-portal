import React, { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, LoginCredentials, SignupData } from '@/contexts/AuthContext';

// Form validation schema for login
const adminLoginSchema = z.object({
  identifier: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

// Form validation schema for signup
const adminSignupSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  identifier: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

const AdminLoginPage = () => {
  const { login, signup, isAuthenticated, user, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();
  
  const loginForm = useForm<LoginCredentials>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const signupForm = useForm<SignupData & { confirmPassword: string }>({
    resolver: zodResolver(adminSignupSchema),
    defaultValues: {
      name: '',
      email: '',
      identifier: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Effect to redirect after successful auth state change
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (data: LoginCredentials) => {
    await login(data, 'admin');
    loginForm.reset();
  };

  const handleSignup = async (data: SignupData & { confirmPassword: string }) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...userData } = data;
    await signup(userData, 'admin');
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
        <div className="h-full w-full bg-nmca-dark/70 backdrop-blur-sm flex items-center justify-center">
          <div className="max-w-md text-white p-8">
            <h1 className="text-4xl font-bold mb-4">Admin Portal</h1>
            <p className="text-xl">Access the administrative functions of the NMCA Learning Management System.</p>
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
            <h1 className="text-2xl font-bold">Admin Portal</h1>
            <p className="text-muted-foreground">Access administrative functions</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Administrator Access</CardTitle>
              <CardDescription>
                This area is restricted to authorized personnel only.
              </CardDescription>
            </CardHeader>

            <Tabs defaultValue="login" onValueChange={handleModeChange}>
              <div className="px-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="identifier">Email</Label>
                      <Input
                        id="identifier"
                        type="email"
                        placeholder="admin@nmca.in"
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
                      className="w-full bg-nmca-dark hover:bg-black" 
                      disabled={loading}
                    >
                      {loading ? 'Signing in...' : 'Admin Sign In'}
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
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="admin@nmca.in"
                        {...signupForm.register('email')}
                        className={signupForm.formState.errors.email ? 'border-red-500' : ''}
                      />
                      {signupForm.formState.errors.email && (
                        <p className="text-red-500 text-xs mt-1">{signupForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-identifier">Admin ID</Label>
                      <Input
                        id="signup-identifier"
                        type="email"
                        placeholder="admin@nmca.in"
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
                      className="w-full bg-nmca-dark hover:bg-black" 
                      disabled={loading}
                    >
                      {loading ? 'Creating Account...' : 'Create Admin Account'}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Not an administrator?{' '}
              <Link to="/login" className="text-nmca-blue hover:underline">
                Student/Staff Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
