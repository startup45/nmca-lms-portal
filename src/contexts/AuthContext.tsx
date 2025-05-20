
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

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
  signup: (userData: SignupData, role: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
  session: Session | null;
};

export type LoginCredentials = {
  identifier: string; // Roll number/Staff ID/Email
  password: string;
};

export type SignupData = {
  name: string;
  email: string;
  identifier: string; // Roll number/Staff ID
  password: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check for existing session and setup auth listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Fetch profile data
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        throw error;
      }

      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email || undefined,
          role: data.role as 'student' | 'staff' | 'admin',
          profilePicture: data.profile_picture || undefined,
        });
      }
    } catch (err: any) {
      console.error('Error fetching user profile:', err.message);
    }
  };

  const login = async (credentials: LoginCredentials, role: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Handle email format - if it doesn't include '@', assume it's an ID and add @gmail.com
      const email = credentials.identifier.includes('@') 
        ? credentials.identifier 
        : `${credentials.identifier}@gmail.com`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: credentials.password,
      });
      
      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('No user returned from login');
      }
      
      // Check if user has the correct role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
        
      if (profileError) {
        throw profileError;
      }
      
      if (profile.role !== role) {
        // Log the user out if they tried to login with the wrong role
        await supabase.auth.signOut();
        throw new Error(`Invalid credentials for ${role} login`);
      }
      
      toast.success(`Welcome back!`);
    } catch (err: any) {
      const errorMessage = err.message || 'An unknown error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const signup = async (userData: SignupData, role: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Make sure email is properly formatted - either use the provided email or format with gmail.com
      const email = userData.email || `${userData.identifier}@gmail.com`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: role,
            identifier: userData.identifier,
          }
        }
      });
      
      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('No user returned from signup');
      }
      
      toast.success('Account created successfully!');
    } catch (err: any) {
      const errorMessage = err.message || 'An unknown error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      setSession(null);
      toast.info('You have been logged out');
    } catch (err: any) {
      const errorMessage = err.message || 'An unknown error occurred';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Password reset instructions have been sent to your email');
    } catch (err: any) {
      const errorMessage = err.message || 'An unknown error occurred';
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
        signup,
        logout,
        forgotPassword,
        isAuthenticated: !!user,
        session,
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
