import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';
import NotificationPopup from './NotificationPopup';
import '../styles/Navbar.css';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  userRole: string | null;
}

const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  isLoggedIn,
  setIsLoggedIn,
  userRole,
}) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  // This function is called when the login modal is closed.
  // If the token exists, it sets the logged-in state and triggers the popup.
  const handleModalClose = () => {
    setShowLoginModal(false);
    if (localStorage.getItem('accessToken')) {
      setIsLoggedIn(true);
      setShowNotification(true);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">Early African Films</Link>
        </div>
        <ul className="navbar-menu">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          {/* Show admin link only if user is an admin */}
          {isLoggedIn && userRole === 'admin' && (
            <li>
              <Link to="/admin">Admin</Link>
            </li>
          )}
        </ul>
        <div className="navbar-controls">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="dark-mode-toggle">
              Logout
            </button>
          ) : (
            <button onClick={handleLoginClick} className="dark-mode-toggle">
              Login
            </button>
          )}
    
        </div>
      </nav>
      {showLoginModal && <LoginModal onLoginSuccess={handleModalClose} onReturnHome={handleModalClose} />}
      {showNotification && (
        <NotificationPopup
          message="Successfully logged in!"
          onClose={() => setShowNotification(false)}
        />
      )}
    </>
  );
};

export default Navbar;
