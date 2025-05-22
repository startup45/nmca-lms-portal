
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Save, RefreshCw, Bell, Shield, Mail, Lock } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  
  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    instituteName: 'NMCA - National Management College of Auditing',
    websiteURL: 'https://nmca.edu.example',
    contactEmail: 'contact@nmca.edu.example',
    supportPhone: '+1 (555) 123-4567'
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    studentEnrollmentAlerts: true,
    staffActivityAlerts: false,
    systemUpdates: true,
  });
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: 90, // days
    sessionTimeout: 30, // minutes
    minimumPasswordLength: 8,
  });
  
  // Handle general settings change
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle notification toggle
  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Handle security settings change
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    
    setSecuritySettings(prev => ({
      ...prev,
      [name]: !isNaN(numValue) ? numValue : value
    }));
  };
  
  // Handle security toggle
  const handleSecurityToggle = (setting: keyof typeof securitySettings) => {
    if (typeof securitySettings[setting] === 'boolean') {
      setSecuritySettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
    }
  };
  
  // Save settings
  const handleSave = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Settings saved successfully');
      setSaving(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">
          Configure system-wide settings for the learning platform.
        </p>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic information about your institution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="instituteName">Institution Name</Label>
                <Input
                  id="instituteName"
                  name="instituteName"
                  value={generalSettings.instituteName}
                  onChange={handleGeneralChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="websiteURL">Website URL</Label>
                <Input
                  id="websiteURL"
                  name="websiteURL"
                  value={generalSettings.websiteURL}
                  onChange={handleGeneralChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={generalSettings.contactEmail}
                  onChange={handleGeneralChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="supportPhone">Support Phone</Label>
                <Input
                  id="supportPhone"
                  name="supportPhone"
                  value={generalSettings.supportPhone}
                  onChange={handleGeneralChange}
                />
              </div>
              
              <Button type="button" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when notifications are sent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable system-wide email notifications
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="studentEnrollmentAlerts">Student Enrollment Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts when students enroll in courses
                  </p>
                </div>
                <Switch
                  id="studentEnrollmentAlerts"
                  checked={notificationSettings.studentEnrollmentAlerts}
                  onCheckedChange={() => handleNotificationToggle('studentEnrollmentAlerts')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="staffActivityAlerts">Staff Activity Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts when staff members make changes
                  </p>
                </div>
                <Switch
                  id="staffActivityAlerts"
                  checked={notificationSettings.staffActivityAlerts}
                  onCheckedChange={() => handleNotificationToggle('staffActivityAlerts')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="systemUpdates">System Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about system updates
                  </p>
                </div>
                <Switch
                  id="systemUpdates"
                  checked={notificationSettings.systemUpdates}
                  onCheckedChange={() => handleNotificationToggle('systemUpdates')}
                />
              </div>
              
              <Button type="button" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Bell className="mr-2 h-4 w-4" />
                    Save Notification Settings
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security settings for the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require two-factor authentication for all staff accounts
                  </p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={securitySettings.twoFactorAuth as boolean}
                  onCheckedChange={() => handleSecurityToggle('twoFactorAuth')}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                <Input
                  id="passwordExpiry"
                  name="passwordExpiry"
                  type="number"
                  min="0"
                  value={securitySettings.passwordExpiry}
                  onChange={handleSecurityChange}
                />
                <p className="text-sm text-muted-foreground">
                  Number of days before passwords expire (0 for never)
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  name="sessionTimeout"
                  type="number"
                  min="5"
                  value={securitySettings.sessionTimeout}
                  onChange={handleSecurityChange}
                />
                <p className="text-sm text-muted-foreground">
                  Time of inactivity before users are logged out
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="minimumPasswordLength">Minimum Password Length</Label>
                <Input
                  id="minimumPasswordLength"
                  name="minimumPasswordLength"
                  type="number"
                  min="6"
                  max="20"
                  value={securitySettings.minimumPasswordLength}
                  onChange={handleSecurityChange}
                />
              </div>
              
              <Button type="button" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Save Security Settings
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
