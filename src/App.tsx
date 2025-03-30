import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import './styles/App.css';
import HomePage from './components/HomePage';
import MovieDetailsPage from './components/MovieDetailsPage';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';

// Define an interface for our decoded JWT payload.
interface JwtPayload {
  role: string;
}

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // When isLoggedIn changes, decode the token to extract the user's role.
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUserRole(decoded.role);
      } catch (err) {
        console.error('Failed to decode token', err);
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, [isLoggedIn]);

  return (
    <Router>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        userRole={userRole}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/movie/:id"
          element={<MovieDetailsPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
        />
        {/* Admin dashboard – only visible to admins. Backend will enforce the check too. */}
        <Route path="/admin" element={<AdminDashboard />}>
          {/* Add additional admin routes as needed */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
