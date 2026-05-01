import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AuthContext = createContext();

const getAuthApiUrl = () => {
  if (process.env.REACT_APP_BACKEND_URL) {
    return `${process.env.REACT_APP_BACKEND_URL}/api`;
  }
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8001/api';
  }
  return '/api';
};

const API = getAuthApiUrl();

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, {
        withCredentials: true
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Google OAuth Login
  const loginWithGoogle = useCallback(async (redirectUri = '/dashboard') => {
    try {
      const response = await axios.get(`${API}/auth/google`, {
        params: { redirect_uri: redirectUri }
      });
      // Redirect to Google OAuth
      window.location.href = response.data.auth_url;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }, []);

  // GitHub OAuth Login
  const loginWithGithub = useCallback(async (redirectUri = '/dashboard') => {
    try {
      const response = await axios.get(`${API}/auth/github`, {
        params: { redirect_uri: redirectUri }
      });
      // Redirect to GitHub OAuth
      window.location.href = response.data.auth_url;
    } catch (error) {
      console.error('GitHub login error:', error);
      throw error;
    }
  }, []);

  // Handle OAuth callback
  const handleOAuthCallback = useCallback(async (provider, code) => {
    try {
      const response = await axios.post(
        `${API}/auth/${provider}/callback`,
        { code },
        { withCredentials: true }
      );
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response.data.user;
    } catch (error) {
      console.error(`${provider} OAuth callback error:`, error);
      throw error;
    }
  }, []);

  // Email/Password Registration
  const register = useCallback(async (name, email, password) => {
    try {
      const response = await axios.post(`${API}/auth/register`, {
        name,
        email,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }, []);

  // Email/Password Login
  const loginWithEmail = useCallback(async (email, password) => {
    try {
      const response = await axios.post(
        `${API}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response.data.user;
    } catch (error) {
      console.error('Email login error:', error);
      throw error;
    }
  }, []);

  // Default login method - uses Google
  const login = useCallback(() => {
    loginWithGoogle();
  }, [loginWithGoogle]);

  const logout = useCallback(async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const updateProfile = useCallback(async (data) => {
    const response = await axios.put(`${API}/auth/profile`, data, {
      withCredentials: true
    });
    setUser(response.data);
    return response.data;
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated,
    login,
    loginWithGoogle,
    loginWithGithub,
    loginWithEmail,
    register,
    handleOAuthCallback,
    logout,
    updateProfile,
    checkAuth
  }), [user, loading, isAuthenticated, login, loginWithGoogle, loginWithGithub, loginWithEmail, register, handleOAuthCallback, logout, updateProfile, checkAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
