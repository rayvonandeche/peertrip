import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = ({ activeRoute = '' }) => {
  const { user, signOut } = useAuth();
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/discover', label: 'Discover' },
    { path: '/peers', label: 'Travel Buddies' },
    { path: '/trips', label: 'Trips & Reviews' },
    { path: '/ai-assistant', label: 'AI Assistant' },
    { path: '/profile', label: 'Profile' }
  ];

  return (
    <header>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            <i className="fas fa-compass"></i>
            PeerTrip
          </Link>
          <div className="nav-links">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={activeRoute === link.path ? 'active' : ''}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="auth-buttons">
            {user ? (
              <div className="user-menu">
                <div className="user-info">
                  <img 
                    src={user.avatar || 'https://via.placeholder.com/32'} 
                    alt={user.name} 
                    className="user-avatar"
                  />
                  <span className="user-name">{user.name}</span>
                </div>
                <button className="btn logout-btn" onClick={signOut}>
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link to="/signin" className="btn login-btn">
                  Sign In
                </Link>
                <Link to="/signup" className="btn signup-btn">
                  Join Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
