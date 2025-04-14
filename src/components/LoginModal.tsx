import React, { useState } from 'react';
import '../styles/LoginModal.css';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        throw new Error('Invalid credentials');
      }
      const data = await res.json();
      localStorage.setItem('accessToken', data.access_token);
      onClose(); // Close modal and let parent re-fetch data
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <h2>Please Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="submit-button" onClick={handleLogin}>
          Login
        </button>
        <button className="close-button" onClick={onClose}>
          Return Home
        </button>
        <div className="additional-info">
          <p>
            If you are not a member of EAC, please reach out to{' '}
            <a href="mailto:your-email@example.com">vbouchar@iu.edu</a> to get access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
