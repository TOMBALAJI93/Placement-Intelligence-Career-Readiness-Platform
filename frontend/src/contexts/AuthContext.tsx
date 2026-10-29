import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Role = 'student' | 'faculty' | 'admin' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  dbmsCompletedLevels?: number[];
  dbmsLevel?: number;
  dbmsMastery?: string;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  useEffect(() => {
    // Check for stored token and user
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setRole(parsedUser.role);
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsInitializing(false);
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setRole(userData.role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated: !!user, isInitializing, login, logout }}>
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
