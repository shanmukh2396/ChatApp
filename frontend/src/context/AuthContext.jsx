import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('chat_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Check current session on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('chat_token');
      try {
        const { data } = await api.get('/auth/me');
        if (data.success && data.data) {
          setUser(data.data);
          localStorage.setItem('chat_user', JSON.stringify(data.data));
        }
      } catch (error) {
        // Only clear if server explicitly says 401 or token was missing
        if (error.response?.status === 401 || !token) {
          setUser(null);
          localStorage.removeItem('chat_user');
          localStorage.removeItem('chat_token');
        }
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
        const userData = data.data;
        if (userData.token) {
          localStorage.setItem('chat_token', userData.token);
        }
        localStorage.setItem('chat_user', JSON.stringify(userData));
        setUser(userData);
        toast.success(`Welcome back, ${userData.name}!`);
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
        const userData = data.data;
        if (userData.token) {
          localStorage.setItem('chat_token', userData.token);
        }
        localStorage.setItem('chat_user', JSON.stringify(userData));
        setUser(userData);
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
      localStorage.removeItem('chat_token');
      localStorage.removeItem('chat_user');
      toast.success('Logged out successfully');
    }
  };

  // Fetch short-lived socket ticket for real-time connection (or fallback to auth token)
  const getSocketTicket = async () => {
    try {
      const { data } = await api.get('/auth/socket-ticket');
      if (data.data?.ticket) {
        return data.data.ticket;
      }
    } catch (error) {
      console.warn('Error fetching socket ticket, using auth token fallback:', error.message);
    }
    return localStorage.getItem('chat_token') || null;
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updatedData };
      localStorage.setItem('chat_user', JSON.stringify(updated));
      return updated;
    });
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
