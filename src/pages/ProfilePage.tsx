
import React, { useState } from 'react';
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
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const {
    register: profileRegister,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
    },
  });
  
  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    // In a real app, we would send this to an API
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    // In a real app, we would send this to an API
    toast.success("Password changed successfully!");
    resetPasswordForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Profile</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-6">
        <Card className="col-span-6 md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback className="text-4xl">{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <p className="mt-4 font-medium text-xl">{user?.name}</p>
            <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
            
            <Button variant="outline" className="mt-4 w-full">
              Change Picture
            </Button>
          </CardContent>
        </Card>
        
        <div className="col-span-6 md:col-span-4">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details here.</CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Details
                    </Button>
                  )}
                </CardHeader>
                <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        {...profileRegister('name')}
                        readOnly={!isEditing}
                        className={profileErrors.name ? 'border-red-500' : ''}
                      />
                      {profileErrors.name && (
                        <p className="text-red-500 text-xs mt-1">{profileErrors.name.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...profileRegister('email')}
                        readOnly={!isEditing}
                        className={profileErrors.email ? 'border-red-500' : ''}
                      />
                      {profileErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{profileErrors.email.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...profileRegister('phone')}
                        readOnly={!isEditing}
                        className={profileErrors.phone ? 'border-red-500' : ''}
                      />
                      {profileErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{profileErrors.phone.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input
                        value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  </CardContent>
                  
                  {isEditing && (
                    <CardFooter className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </CardFooter>
                  )}
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password here.</CardDescription>
                </CardHeader>
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        {...passwordRegister('currentPassword')}
                        className={passwordErrors.currentPassword ? 'border-red-500' : ''}
                      />
                      {passwordErrors.currentPassword && (
                        <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        {...passwordRegister('newPassword')}
                        className={passwordErrors.newPassword ? 'border-red-500' : ''}
                      />
                      {passwordErrors.newPassword && (
                        <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...passwordRegister('confirmPassword')}
                        className={passwordErrors.confirmPassword ? 'border-red-500' : ''}
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword.message}</p>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button type="submit" className="ml-auto">Update Password</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
