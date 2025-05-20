
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email?: string;
  role: 'student' | 'staff' | 'admin';
  profilePicture?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials, role: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
};

type LoginCredentials = {
  identifier: string; // Roll number/Staff ID/Email
  password: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock data for demonstration purposes
const MOCK_USERS = [
  { 
    id: 'student1', 
    name: 'John Doe', 
    role: 'student', 
    identifier: 'S12345', 
    password: 'password123',
    profilePicture: 'https://i.pravatar.cc/150?u=student1',
    email: 'john.doe@example.com'
  },
  { 
    id: 'staff1', 
    name: 'Dr. Jane Smith', 
    role: 'staff', 
    identifier: 'T54321', 
    password: 'password123',
    profilePicture: 'https://i.pravatar.cc/150?u=staff1',
    email: 'jane.smith@example.com'
  },
  { 
    id: 'admin1', 
    name: 'Admin User', 
    role: 'admin', 
    identifier: 'admin@nmca.in', 
    password: 'adminpass',
    profilePicture: 'https://i.pravatar.cc/150?u=admin1',
    email: 'admin@nmca.in'
  },
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('nmcaUser');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Failed to parse stored user', err);
        localStorage.removeItem('nmcaUser');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials, roleType: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const matchedUser = MOCK_USERS.find(
        u => u.identifier === credentials.identifier && 
             u.password === credentials.password && 
             u.role === roleType
      );
      
      if (!matchedUser) {
        throw new Error('Invalid credentials or role');
      }

      // Create user object without password
      const { password, identifier, ...userWithoutSensitiveInfo } = matchedUser;
      
      // Store in localStorage
      localStorage.setItem('nmcaUser', JSON.stringify(userWithoutSensitiveInfo));
      
      setUser(userWithoutSensitiveInfo as User);
      toast.success(`Welcome back, ${userWithoutSensitiveInfo.name}!`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('nmcaUser');
    setUser(null);
    toast.info('You have been logged out');
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email exists in mock data
      const userExists = MOCK_USERS.some(u => u.email === email);
      
      if (!userExists) {
        throw new Error('No account found with this email');
      }
      
      toast.success('Password reset instructions have been sent to your email');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        forgotPassword,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
