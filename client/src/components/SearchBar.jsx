import { useState } from 'react';
import { useSocket } from '../socket/socket';
import './SearchBar.css';

function SearchBar() {
  const { searchMessages, searchResults, currentRoom } = useSocket();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      searchMessages(query.trim(), currentRoom);
    }
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search messages..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          🔍
        </button>
      </form>

      {searchResults.length > 0 && (
        <div className="search-results">
          <div className="search-results-header">
            Found {searchResults.length} result(s)
          </div>
          {searchResults.map((message) => (
            <div key={message.id} className="search-result-item">
              <div className="result-sender">{message.sender}</div>
              <div className="result-message">{message.message}</div>
              <div className="result-time">
                {new Date(message.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;

