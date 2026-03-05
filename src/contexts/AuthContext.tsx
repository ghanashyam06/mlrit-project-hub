import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'email' | 'phone' | 'githubLink' | 'linkedinLink'>>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string) => {
    const found = mockUsers.find(u => u.email === email);
    if (found) {
      setUser(found);
      return true;
    }
    setUser(mockUsers[0]);
    return true;
  };

  const logout = () => setUser(null);

  const switchRole = (role: UserRole) => {
    const found = mockUsers.find(u => u.role === role);
    if (found) setUser(found);
  };

  const updateProfile = (updates: Partial<Pick<User, 'name' | 'email' | 'phone' | 'githubLink' | 'linkedinLink'>>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
