import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'cliente' | 'admin' | 'vendedor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const DEMO_USERS: Record<string, { user: User; password: string }> = {
  'admin@volt.com': {
    user: { id: '1', name: 'Administrador', email: 'admin@volt.com', role: 'admin' },
    password: 'admin'
  },
  'vendedor@volt.com': {
    user: { id: '2', name: 'Juan Vendedor', email: 'vendedor@volt.com', role: 'vendedor' },
    password: 'vendedor'
  },
  'cliente@volt.com': {
    user: { id: '3', name: 'Cliente Demo', email: 'cliente@volt.com', role: 'cliente' },
    password: 'cliente'
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    const demoUser = DEMO_USERS[email];
    if (demoUser && demoUser.password === password) {
      setUser(demoUser.user);
      return true;
    }
    if (email && password) {
      setUser({ id: '0', name: 'Usuario', email, role: 'cliente' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}