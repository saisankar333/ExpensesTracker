import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../lib/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('expenseTrackerUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser({
          ...parsedUser,
          createdAt: new Date(parsedUser.createdAt)
        });
      } catch (e) {
        console.error('Failed to parse saved user:', e);
        localStorage.removeItem('expenseTrackerUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Mock API call - in a real app, this would be a fetch to your backend
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      
      // Mock user check (would be done by backend in real app)
      const savedUsers = localStorage.getItem('expenseTrackerUsers');
      let users: any[] = [];
      
      if (savedUsers) {
        users = JSON.parse(savedUsers);
      }
      
      const foundUser = users.find(u => u.email === email);
      
      if (!foundUser || foundUser.password !== password) {
        setError('Invalid email or password');
        setIsLoading(false);
        return false;
      }
      
      // Create user object without the password
      const authenticatedUser: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        createdAt: new Date(foundUser.createdAt)
      };
      
      setUser(authenticatedUser);
      localStorage.setItem('expenseTrackerUser', JSON.stringify(authenticatedUser));
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('Authentication failed. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Mock API call - in a real app, this would be a fetch to your backend
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      
      // Check if user exists
      const savedUsers = localStorage.getItem('expenseTrackerUsers');
      let users: any[] = [];
      
      if (savedUsers) {
        users = JSON.parse(savedUsers);
        if (users.some(u => u.email === email)) {
          setError('User with this email already exists');
          setIsLoading(false);
          return false;
        }
      }
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password, // In a real app, this would be hashed by the backend
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('expenseTrackerUsers', JSON.stringify(users));
      
      // Create user object without the password
      const authenticatedUser: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: new Date(newUser.createdAt)
      };
      
      setUser(authenticatedUser);
      localStorage.setItem('expenseTrackerUser', JSON.stringify(authenticatedUser));
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('Registration failed. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('expenseTrackerUser');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      signup, 
      logout, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};