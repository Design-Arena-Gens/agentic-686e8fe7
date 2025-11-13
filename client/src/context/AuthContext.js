import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const signup = async (name, email, password, age, gender) => {
    const response = await axios.post('/api/auth/signup', {
      name,
      email,
      password,
      age,
      gender
    });
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put('/api/user/profile', profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(response.data.user);
    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
