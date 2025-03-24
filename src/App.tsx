import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './styles/App.css';
import HomePage from './components/HomePage';
import MovieDetailsPage from './components/MovieDetailsPage';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import AddFilmForm from './components/AddFilmForm';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <Router>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="add-film" element={<AddFilmForm />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
