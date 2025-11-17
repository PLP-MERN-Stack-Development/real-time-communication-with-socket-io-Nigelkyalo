import { useState } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (name) => {
    if (name.trim()) {
      setUsername(name.trim());
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setUsername('');
    setIsLoggedIn(false);
  };

  return (
    <div className="app">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat username={username} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;

