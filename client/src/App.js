import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileSetup from './pages/ProfileSetup';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Remedies from './pages/Remedies';
import Chatbot from './pages/Chatbot';

// Components
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile-setup" element={<PrivateRoute><ProfileSetup /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/remedies" element={<PrivateRoute><Remedies /></PrivateRoute>} />
            <Route path="/chatbot" element={<PrivateRoute><Chatbot /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default App;
