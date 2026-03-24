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

  const getBadgeClass = (badge) => {
    switch (badge) {
      case 'Expert': return 'badge-expert';
      case 'Contributor': return 'badge-contributor';
      default: return 'badge-beginner';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">&#x2699;</span>
          <span className="logo-text">SolveNet</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="hamburger"></span>
        </button>

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
              <div className="user-menu">
                <Link to={`/profile/${user?._id}`} className="user-info" onClick={() => setMenuOpen(false)}>
                  <span className={`user-badge ${getBadgeClass(user?.badge)}`}>
                    {user?.badge}
                  </span>
                  <span className="username">{user?.username}</span>
                </Link>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
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
