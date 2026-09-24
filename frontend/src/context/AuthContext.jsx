import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current session on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get('/auth/me');
        if (data.success && data.data) {
          setUser(data.data);
        }
      } catch (error) {
        // Not logged in or expired cookie
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success) {
        setUser(data.data);
        toast.success(`Welcome back, ${data.data.name}!`);
        return { success: true };
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (name, email, password, avatar) => {
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
        avatar,
      });
      if (data.success) {
        setUser(data.data);
        toast.success('Account created successfully!');
        return { success: true };
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed. Try again.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  // Fetch short-lived socket ticket for real-time connection
  const getSocketTicket = async () => {
    try {
      const { data } = await api.get('/auth/socket-ticket');
      return data.data?.ticket || null;
    } catch (error) {
      console.error('Error fetching socket ticket:', error);
      return null;
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : prev));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        getSocketTicket,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
