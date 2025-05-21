
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Form validation schema for admin signup with admin code
const signupSchema = z.object({
  adminCode: z.string().min(1, 'Admin code is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  fullName: z.string().min(1, 'Full name is required'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
}).refine((data) => data.adminCode === 'SECRET123', {
  path: ['adminCode'],
  message: 'Invalid admin code',
});

type SignupFormValues = z.infer<typeof signupSchema>;

const AdminSignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  
  // Add meta tag to prevent indexing
  useEffect(() => {
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex';
    document.getElementsByTagName('head')[0].appendChild(metaRobots);
    
    return () => {
      document.getElementsByTagName('head')[0].removeChild(metaRobots);
    };
  }, []);
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      adminCode: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    // Track attempts
    setAttemptCount(prevCount => prevCount + 1);
    
    // Redirect after 3 attempts
    if (attemptCount >= 2) {
      toast.error('Too many failed attempts. Redirecting to home page.');
      setTimeout(() => navigate('/'), 2000);
      return;
    }
    
    setLoading(true);
    try {
      // For an extra layer of security, check admin code again
      if (data.adminCode !== 'SECRET123') {
        throw new Error('Invalid admin code');
      }
      
      // Prepare signup data
      const signupData = {
        name: data.fullName,
        email: data.email,
        identifier: data.email,
        password: data.password,
      };
      
      await signup(signupData, 'admin');
      toast.success('Admin account created successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create admin account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authorized Admins Only</AlertTitle>
          <AlertDescription>
            Unauthorized access will be reported. This page is monitored.
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardHeader>
            <CardTitle>Admin Sign Up</CardTitle>
            <CardDescription>Create an administrative account</CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="adminCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Security Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter admin code" 
                          {...field} 
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your email" 
                          type="email"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Create a password" 
                          type="password" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Confirm your password" 
                          type="password" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {attemptCount > 0 && (
                  <p className="text-xs text-red-500">
                    Failed attempts: {attemptCount}/3
                  </p>
                )}
              </CardContent>
              
              <CardFooter className="flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-nmca-blue hover:bg-nmca-darkBlue"
                  disabled={loading || attemptCount >= 3}
                >
                  {loading ? 'Creating Account...' : 'Create Admin Account'}
                </Button>
                
                <p className="text-sm text-center">
                  <Link to="/login" className="text-nmca-blue hover:underline">
                    Return to Login
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AdminSignupPage;
