import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../socket/socket';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';
import RoomList from './RoomList';
import SearchBar from './SearchBar';
import './Chat.css';

function Chat({ username, onLogout }) {
  const {
    isConnected,
    messages,
    users,
    typingUsers,
    rooms,
    currentRoom,
    unreadCounts,
    connect,
    disconnect,
    joinRoom,
    createRoom,
    clearUnread,
  } = useSocket();

  const [showRooms, setShowRooms] = useState(false);
  const [showUsers, setShowUsers] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    connect(username, 'general');
    return () => {
      disconnect();
    };
  }, [username, connect, disconnect]);

  useEffect(() => {
    if (currentRoom) {
      clearUnread(currentRoom);
    }
  }, [currentRoom, clearUnread]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRoomChange = (roomId) => {
    joinRoom(roomId);
    setShowRooms(false);
  };

  const handleCreateRoom = (roomName) => {
    createRoom(roomName);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-left">
          <h2>💬 Real-Time Chat</h2>
          <div className="connection-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></span>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        <div className="chat-header-right">
          <span className="current-room">Room: {currentRoom}</span>
          <span className="username">👤 {username}</span>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-sidebar">
          <div className="sidebar-section">
            <button
              className={`sidebar-toggle ${showRooms ? 'active' : ''}`}
              onClick={() => setShowRooms(!showRooms)}
            >
              📁 Rooms
            </button>
            {showRooms && (
              <RoomList
                rooms={rooms}
                currentRoom={currentRoom}
                onRoomChange={handleRoomChange}
                onCreateRoom={handleCreateRoom}
                unreadCounts={unreadCounts}
              />
            )}
          </div>

          <div className="sidebar-section">
            <button
              className={`sidebar-toggle ${showUsers ? 'active' : ''}`}
              onClick={() => setShowUsers(!showUsers)}
            >
              👥 Users ({users.length})
            </button>
            {showUsers && <UserList users={users} currentUsername={username} />}
          </div>
        </div>

        <div className="chat-content">
          <div className="chat-toolbar">
            <button
              className={`toolbar-button ${showSearch ? 'active' : ''}`}
              onClick={() => setShowSearch(!showSearch)}
            >
              🔍 Search
            </button>
          </div>

          {showSearch && <SearchBar />}

          <MessageList
            messages={messages}
            currentUsername={username}
            typingUsers={typingUsers}
            messagesEndRef={messagesEndRef}
          />

          <MessageInput currentRoom={currentRoom} />
        </div>
      </div>
    </div>
  );
}

export default Chat;

