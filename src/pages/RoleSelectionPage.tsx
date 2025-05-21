
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users } from 'lucide-react';

const RoleSelectionPage = () => {
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
            <h1 className="text-2xl font-bold">Choose Your Role</h1>
            <p className="text-muted-foreground">Select how you'll be using the platform</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <Link to="/signup-student" className="block">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer border-2 hover:border-nmca-blue">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>NMC Students</CardTitle>
                  <GraduationCap className="h-8 w-8 text-nmca-blue" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sign up as a student to access courses, track your progress, and engage with learning materials.
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/signup-staff" className="block">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer border-2 hover:border-nmca-blue">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>Staff</CardTitle>
                  <Users className="h-8 w-8 text-nmca-blue" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sign up as staff to manage courses, support students, and access teaching resources.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-nmca-blue hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
