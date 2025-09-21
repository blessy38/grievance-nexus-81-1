import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { authService, type UserData } from '@/lib/auth';

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserData>;
  register: (email: string, password: string, userData: {
    name: string;
    phoneNumber: string;
    address: string;
  }) => Promise<UserData>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<UserData> => {
    const userData = await authService.login(email, password);
    setUser(userData);
    return userData;
  };

  const register = async (email: string, password: string, userData: {
    name: string;
    phoneNumber: string;
    address: string;
  }): Promise<UserData> => {
    const newUserData = await authService.register(email, password, userData);
    setUser(newUserData);
    return newUserData;
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
