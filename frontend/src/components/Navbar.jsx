import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuth();

    const handleAuthChange = () => checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth-change', handleAuthChange);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">&#x2699;</span>
          <span className="logo-text">SolveNet</span>
        </Link>

        {/* <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="hamburger"></span>
        </button> */}

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <Link to="/problems" className="nav-link" onClick={() => setMenuOpen(false)}>
            Problems
          </Link>
          <Link to="/archive" className="nav-link" onClick={() => setMenuOpen(false)}>
            Archive
          </Link>
          <Link to="/leaderboard" className="nav-link" onClick={() => setMenuOpen(false)}>
            Leaderboard
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/create-problem" className="nav-link btn-create" onClick={() => setMenuOpen(false)}>
                + Create Problem
              </Link>
              <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to={`/profile/${user?._id}`} className="profile-icon" onClick={() => setMenuOpen(false)}>
                {user?.username?.charAt(0).toUpperCase()}
              </Link>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="nav-link btn-login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="nav-link btn-register" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
