import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode, isLoggedIn, setIsLoggedIn }) => {
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    // Optionally, you can force a re-render or trigger any necessary cleanup.
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Early African Films</Link>
      </div>
      <ul className="navbar-menu">
        <li><Link to="/">Home</Link></li>
        <li className="dropdown">
          <Link to="/browse">Browse Movies</Link>
          <div className="dropdown-content">
            <Link to="/browse/genre">Genre</Link>
            <Link to="/browse/era">Era</Link>
            <Link to="/browse/director">Director</Link>
          </div>
        </li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/admin">Admin</Link></li>
      </ul>
      <div className="navbar-controls">
      
        {isLoggedIn && (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
