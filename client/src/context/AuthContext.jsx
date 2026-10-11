import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('medialert_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          const res = await api.getProfile();
          setUser(res.user);
        } else {
          // Auto demo user for seamless test experience
          await demoLogin(false);
        }
      } catch (err) {
        console.warn('Failed to fetch existing user, trying demo login:', err);
        await demoLogin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.login({ email, password });
      localStorage.setItem('medialert_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const res = await api.register(userData);
      localStorage.setItem('medialert_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const demoLogin = async (notify = true) => {
    setError(null);
    try {
      // First ensure demo data is seeded
      await api.seedDemo().catch(() => {});
      const res = await api.login({ email: 'sandip123@gmail.com', password: 'password123' });
      localStorage.setItem('medialert_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    } catch (err) {
      // Fallback demo user object if backend is momentarily restarting
      const fallbackUser = {
        id: 'demo-sandip',
        name: 'Sandip Punani',
        email: 'sandip123@gmail.com',
        mobile: '+91 98765 43210',
        dob: '12 Jan 2000',
        avatar: 'SP',
        notificationSettings: { sound: true, browser: true, boxSync: true }
      };
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('medialert_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.updateProfile(profileData);
      setUser(res.user);
      return res.user;
    } catch (err) {
      setError(err.message || 'Profile update failed');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        demoLogin,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
