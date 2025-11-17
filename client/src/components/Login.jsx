import { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">💬 Real-Time Chat</h1>
        <p className="login-subtitle">Enter your username to start chatting</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="login-input"
            autoFocus
            maxLength={20}
          />
          <button type="submit" className="login-button">
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

