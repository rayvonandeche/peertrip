import React, { createContext, useContext, useState, useEffect } from 'react';
import backendService from '../services/backendService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('peertrip_user');
    const savedToken = localStorage.getItem('auth_token');
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        backendService.setToken(savedToken);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('peertrip_user');
        localStorage.removeItem('auth_token');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('peertrip_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('peertrip_user');
    }
  }, [user]);

  const signIn = async (email, password) => {
    try {
      const result = await backendService.signIn(email, password);
      
      if (result.success) {
        setUser(result.user);
        return { success: true, message: 'Welcome back!' };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, message: 'Sign in failed. Please try again.' };
    }
  };

  const signUp = async (userData) => {
    try {
      const result = await backendService.signUp(userData);
      
      if (result.success) {
        setUser(result.user);
        return { success: true, message: 'Welcome to PeerTrip!' };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, message: 'Sign up failed. Please try again.' };
    }
  };

  const signOut = () => {
    setUser(null);
    backendService.setToken(null);
    localStorage.removeItem('peertrip_user');
    localStorage.removeItem('auth_token');
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    logout: signOut,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
