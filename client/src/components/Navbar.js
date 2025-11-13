import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <span className="logo">🍃 AnnapurnaAI</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/remedies" className="nav-link">Remedies</Link>
              <Link to="/chatbot" className="nav-link">Chatbot</Link>
              <button onClick={handleLogout} className="btn btn-logout">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-login">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
