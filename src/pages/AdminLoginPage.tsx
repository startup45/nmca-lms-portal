
import React from 'react';
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
import { useAuth } from '@/contexts/AuthContext';

// Form validation schema
const adminLoginSchema = z.object({
  identifier: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

const AdminLoginPage = () => {
  const { login, isAuthenticated, user, loading } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  // If already authenticated as admin, redirect to admin dashboard
  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If authenticated but not as admin, redirect to regular dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: AdminLoginFormData) => {
    await login(data, 'admin');
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
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-muted-foreground">Sign in to access administrative functions</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Administrator Access</CardTitle>
              <CardDescription>
                This area is restricted to authorized personnel only.
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">Email</Label>
                  <Input
                    id="identifier"
                    type="email"
                    placeholder="admin@nmca.in"
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
                  className="w-full bg-nmca-dark hover:bg-black" 
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Admin Sign In'}
                </Button>
              </CardFooter>
            </form>
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
