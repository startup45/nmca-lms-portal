
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
import { useAuth } from '@/contexts/AuthContext';

// Form validation schema
const loginSchema = z.object({
  identifier: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [role, setRole] = useState<'student' | 'staff'>('student');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    await login(data, role);
    reset();
  };

  const handleRoleChange = (value: string) => {
    setRole(value as 'student' | 'staff');
    reset();
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
            <p className="text-muted-foreground">Sign in to access your courses</p>
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
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">
                    {role === 'student' ? 'Roll Number' : 'Staff ID'}
                  </Label>
                  <Input
                    id="identifier"
                    placeholder={role === 'student' ? 'Enter your roll number' : 'Enter your staff ID'}
                    {...register('identifier')}
                    className={errors.identifier ? 'border-red-500' : ''}
                    autoComplete="username"
                  />
                  {errors.identifier && (
                    <p className="text-red-500 text-xs mt-1">{errors.identifier.message}</p>
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
                    {...register('password')}
                    className={errors.password ? 'border-red-500' : ''}
                    autoComplete="current-password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
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
