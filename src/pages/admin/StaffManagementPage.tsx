
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModalForm } from '@/components/ui/modal-form';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Pencil, Plus, Trash2, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Define interfaces for our data
interface Staff {
  id: string;
  name: string;
  email: string;
}

// Mock data generator
const generateMockStaff = (count: number) => {
  const staff: Staff[] = [];
  
  for (let i = 1; i <= count; i++) {
    staff.push({
      id: `staff-${i}`,
      name: `Staff Member ${i}`,
      email: `staff${i}@example.com`,
    });
  }
  
  return staff;
};

const StaffManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Load staff data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we would fetch from Supabase
        // For now, we'll use mock data
        setTimeout(() => {
          const mockStaff = generateMockStaff(8); // 8 staff members as requested
          setStaff(mockStaff);
          setIsLoading(false);
        }, 800); // Simulate loading delay
      } catch (error) {
        console.error('Error fetching staff data:', error);
        toast.error('Failed to load staff data');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Open the create/edit modal
  const openModal = (staffMember?: Staff) => {
    if (staffMember) {
      setCurrentStaff(staffMember);
      setFormData({
        name: staffMember.name,
        email: staffMember.email,
        password: '',
        confirmPassword: ''
      });
    } else {
      setCurrentStaff(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    }
    setIsModalOpen(true);
  };
  
  // Open the delete confirmation modal
  const openDeleteModal = (staffMember: Staff) => {
    setCurrentStaff(staffMember);
    setIsDeleteModalOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!currentStaff && (!formData.password || formData.password !== formData.confirmPassword)) {
      toast.error(formData.password ? "Passwords do not match" : "Password is required");
      return;
    }
    
    // Mock create/update staff
    setTimeout(() => {
      if (currentStaff) {
        // Update existing staff
        const updatedStaff = staff.map(s => 
          s.id === currentStaff.id ? { ...s, name: formData.name, email: formData.email } : s
        );
        setStaff(updatedStaff);
        toast.success(`Staff "${formData.name}" updated successfully`);
      } else {
        // Create new staff
        const newStaff: Staff = {
          id: `staff-${Date.now()}`,
          name: formData.name,
          email: formData.email
        };
        setStaff([newStaff, ...staff]);
        toast.success(`Staff "${formData.name}" created successfully`);
      }
      
      // Close modal and reset form
      setIsModalOpen(false);
      setCurrentStaff(null);
    }, 500);
  };
  
  // Handle staff deletion
  const handleDelete = () => {
    if (!currentStaff) return;
    
    // Mock delete staff
    setTimeout(() => {
      const filteredStaff = staff.filter(s => s.id !== currentStaff.id);
      setStaff(filteredStaff);
      toast.success(`Staff "${currentStaff.name}" deleted successfully`);
      
      // Close modal and reset state
      setIsDeleteModalOpen(false);
      setCurrentStaff(null);
    }, 500);
  };
  
  // Table columns
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">
            View, create, edit and delete staff accounts.
          </p>
        </div>
        <Button onClick={() => openModal()} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Staff List</CardTitle>
          <CardDescription>
            Total Staff: {isLoading ? '...' : staff.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2">Loading staff data...</span>
            </div>
          ) : (
            <DataTable 
              data={staff}
              columns={columns}
              searchKeys={['name', 'email']}
              itemsPerPage={10}
              emptyMessage="No staff found."
              exportOptions={{
                filename: "staff-list",
                enableCSV: true,
                enablePDF: true,
                enableWord: true
              }}
              actions={(staffMember) => (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => openModal(staffMember)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => openDeleteModal(staffMember)}
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              )}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Create/Edit Staff Modal */}
      <ModalForm
        title={currentStaff ? "Edit Staff" : "Add New Staff"}
        description={currentStaff ? "Update staff information" : "Create a new staff account"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        submitLabel={currentStaff ? "Save Changes" : "Create Staff"}
      >
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          {!currentStaff && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!currentStaff}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!currentStaff}
                />
              </div>
            </>
          )}
        </div>
      </ModalForm>
      
      {/* Delete Confirmation Modal */}
      <ModalForm
        title="Delete Staff"
        description={`Are you sure you want to delete ${currentStaff?.name}? This action cannot be undone.`}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSubmit={handleDelete}
        submitLabel="Delete"
      >
        <div className="pt-2 pb-4">
          <p className="text-sm font-medium text-destructive">
            This will permanently delete the staff account and all associated data.
          </p>
        </div>
      </ModalForm>
    </div>
  );
};

export default StaffManagementPage;
