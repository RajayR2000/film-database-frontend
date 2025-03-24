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
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default LoginModal;
