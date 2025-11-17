import { useState } from 'react';
import { useSocket } from '../socket/socket';
import './UserList.css';

function UserList({ users, currentUsername }) {
  const { sendPrivateMessage } = useSocket();
  const [selectedUser, setSelectedUser] = useState(null);
  const [privateMessage, setPrivateMessage] = useState('');

  const handleSendPrivateMessage = (userId) => {
    if (privateMessage.trim()) {
      sendPrivateMessage(userId, privateMessage.trim());
      setPrivateMessage('');
      setSelectedUser(null);
    }
  };

  return (
    <div className="user-list">
      {users.length === 0 ? (
        <div className="empty-users">No users online</div>
      ) : (
        users.map((user) => (
          <div key={user.id} className="user-item">
            <div className="user-info">
              <span className="user-status"></span>
              <span className="user-name">
                {user.username}
                {user.username === currentUsername && ' (You)'}
              </span>
            </div>
            {user.username !== currentUsername && (
              <button
                className="pm-button"
                onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                title="Send private message"
              >
                💬
              </button>
            )}
            {selectedUser === user.id && (
              <div className="pm-input-container">
                <input
                  type="text"
                  value={privateMessage}
                  onChange={(e) => setPrivateMessage(e.target.value)}
                  placeholder="Private message..."
                  className="pm-input"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendPrivateMessage(user.id);
                    }
                  }}
                />
                <button
                  className="pm-send-button"
                  onClick={() => handleSendPrivateMessage(user.id)}
                >
                  Send
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default UserList;

