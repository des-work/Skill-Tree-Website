import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    let cancelled = false;
    const safetyTimeout = setTimeout(() => {
      if (!cancelled) {
        setLoading(false);
      }
    }, 8000);

    if (token) {
      loadUserProfile().finally(() => {
        if (!cancelled) {
          clearTimeout(safetyTimeout);
          setLoading(false);
        }
      });
    } else {
      clearTimeout(safetyTimeout);
      setLoading(false);
    }
    return () => { cancelled = true; clearTimeout(safetyTimeout); };
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      localStorage.removeItem('token');
    }
  };

  const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setUser(user);
    return response.data;
  };

  const register = async (username, email, password, hackerName) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
      hackerName,
    });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setUser(user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const response = await api.put('/auth/profile', updates);
    setUser(response.data.user);
    return response.data;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

