import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Plus, UserPlus, TrashIcon, ShieldAlert, CheckCircle, XCircle, UserCog } from 'lucide-react';
import { ModalForm } from '@/components/ui/modal-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'student';
  status: 'active' | 'pending' | 'disabled';
  dateJoined: string;
  lastActive: string;
}

const UserManagementPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student' as 'admin' | 'staff' | 'student',
    status: 'active' as 'active' | 'pending' | 'disabled'
  });
  
  // Load users data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we would fetch from Supabase
        setTimeout(() => {
          const mockUsers = generateMockUsers(65);
          setUsers(mockUsers);
          setIsLoading(false);
        }, 800); // Simulate loading delay
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const generateMockUsers = (count: number): User[] => {
    const users: User[] = [];
    
    // Generate mostly students
    for (let i = 1; i <= count; i++) {
      // Make sure we have at least a few admins and staff
      let role: 'admin' | 'staff' | 'student';
      if (i <= 5) {
        role = 'admin';
      } else if (i <= 15) {
        role = 'staff';
      } else {
        role = 'student';
      }
      
      // Generate random date in the past year
      const dateJoined = new Date();
      dateJoined.setDate(dateJoined.getDate() - Math.floor(Math.random() * 365));
      
      const lastActive = new Date();
      lastActive.setDate(lastActive.getDate() - Math.floor(Math.random() * 30));
      
      // Status is mostly active
      const status = Math.random() > 0.2 ? 'active' as const : (Math.random() > 0.5 ? 'pending' as const : 'disabled' as const);
      
      users.push({
        id: `user-${i}`,
        name: `${role === 'admin' ? 'Admin' : role === 'staff' ? 'Staff' : 'Student'} ${i}`,
        email: `${role}${i}@example.com`,
        role,
        status,
        dateJoined: dateJoined.toISOString().split('T')[0],
        lastActive: lastActive.toISOString().split('T')[0],
      });
    }
    
    return users;
  };
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setIsUserModalOpen(true);
  };
  
  const handleAddUser = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'student' as 'admin' | 'staff' | 'student',
      status: 'active' as 'active' | 'pending' | 'disabled'
    });
    setIsUserModalOpen(true);
  };
  
  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      // In a real app, we would send this to the backend
      setUsers(users.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    }
  };
  
  const handleSubmitUserForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedUser) {
      // Edit existing user
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...formData } as User
          : user
      ));
      toast.success('User updated successfully');
    } else {
      // Add new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        dateJoined: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
      };
      
      setUsers([newUser, ...users]);
      toast.success('User added successfully');
    }
    
    setIsUserModalOpen(false);
  };
  
  const filteredUsers = activeTab === 'all' 
    ? users 
    : users.filter(user => user.role === activeTab);
  
  const columns = [
    { 
      key: 'name', 
      header: 'Name',
      cell: (user: User) => (
        <div className="font-medium">{user.name}</div>
      )
    },
    { key: 'email', header: 'Email' },
    { 
      key: 'role', 
      header: 'Role',
      cell: (user: User) => (
        <div className="flex items-center">
          {user.role === 'admin' && (
            <span className="flex items-center text-red-600">
              <ShieldAlert size={16} className="mr-1" /> Admin
            </span>
          )}
          {user.role === 'staff' && (
            <span className="flex items-center text-blue-600">
              <UserCog size={16} className="mr-1" /> Staff
            </span>
          )}
          {user.role === 'student' && (
            <span className="flex items-center text-green-600">
              <UserPlus size={16} className="mr-1" /> Student
            </span>
          )}
        </div>
      )
    },
    {
      key: 'status', 
      header: 'Status',
      cell: (user: User) => (
        <div className="flex items-center">
          {user.status === 'active' && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              <CheckCircle size={14} className="mr-1" /> Active
            </span>
          )}
          {user.status === 'pending' && (
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
              Pending
            </span>
          )}
          {user.status === 'disabled' && (
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
              <XCircle size={14} className="mr-1" /> Disabled
            </span>
          )}
        </div>
      )
    },
    { key: 'dateJoined', header: 'Join Date' },
    { key: 'lastActive', header: 'Last Active' },
    {
      key: 'actions',
      header: 'Actions',
      cell: (user: User) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleEditUser(user)}
          >
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDeleteUser(user.id)}
            className="text-red-500 hover:text-red-700"
          >
            <TrashIcon size={16} />
          </Button>
        </div>
      )
    },
  ];
  
  const userCounts = {
    all: users.length,
    admin: users.filter(user => user.role === 'admin').length,
    staff: users.filter(user => user.role === 'staff').length,
    student: users.filter(user => user.role === 'student').length
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage all users across the platform.
        </p>
      </div>
      
      {/* User statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userCounts.all}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{userCounts.admin}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{userCounts.staff}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{userCounts.student}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </div>
          <Button onClick={handleAddUser}>
            <Plus size={16} className="mr-1" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Users ({userCounts.all})</TabsTrigger>
              <TabsTrigger value="admin">Admins ({userCounts.admin})</TabsTrigger>
              <TabsTrigger value="staff">Staff ({userCounts.staff})</TabsTrigger>
              <TabsTrigger value="student">Students ({userCounts.student})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2">Loading user data...</span>
                </div>
              ) : (
                <DataTable
                  data={filteredUsers}
                  columns={columns}
                  searchKeys={['name', 'email']}
                  itemsPerPage={10}
                  emptyMessage="No users found"
                  exportOptions={{
                    filename: "users-list",
                    enableCSV: true,
                    enablePDF: true
                  }}
                />
              )}
            </TabsContent>
            
            <TabsContent value="admin" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2">Loading admin data...</span>
                </div>
              ) : (
                <DataTable
                  data={filteredUsers}
                  columns={columns}
                  searchKeys={['name', 'email']}
                  itemsPerPage={10}
                  emptyMessage="No admin users found"
                />
              )}
            </TabsContent>
            
            <TabsContent value="staff" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2">Loading staff data...</span>
                </div>
              ) : (
                <DataTable
                  data={filteredUsers}
                  columns={columns}
                  searchKeys={['name', 'email']}
                  itemsPerPage={10}
                  emptyMessage="No staff users found"
                />
              )}
            </TabsContent>
            
            <TabsContent value="student" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2">Loading student data...</span>
                </div>
              ) : (
                <DataTable
                  data={filteredUsers}
                  columns={columns}
                  searchKeys={['name', 'email']}
                  itemsPerPage={10}
                  emptyMessage="No student users found"
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Add/Edit User Modal */}
      <ModalForm
        title={selectedUser ? "Edit User" : "Add New User"}
        description={selectedUser ? `Editing ${selectedUser.name}` : "Enter user details below"}
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSubmit={handleSubmitUserForm}
        submitLabel={selectedUser ? "Save Changes" : "Add User"}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter user name"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({...formData, role: value as 'admin' | 'staff' | 'student'})}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({...formData, status: value as 'active' | 'pending' | 'disabled'})}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ModalForm>
    </div>
  );
};

export default UserManagementPage;
