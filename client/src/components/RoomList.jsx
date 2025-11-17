import { useState } from 'react';
import { useSocket } from '../socket/socket';
import './RoomList.css';

function RoomList({ rooms, currentRoom, onRoomChange, onCreateRoom, unreadCounts }) {
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (newRoomName.trim() && !rooms.includes(newRoomName.trim())) {
      onCreateRoom(newRoomName.trim());
      setNewRoomName('');
      setShowCreateRoom(false);
    }
  };

  return (
    <div className="room-list">
      <div className="room-list-header">
        <button
          className="create-room-button"
          onClick={() => setShowCreateRoom(!showCreateRoom)}
        >
          {showCreateRoom ? '✕ Cancel' : '+ Create Room'}
        </button>
      </div>

      {showCreateRoom && (
        <form onSubmit={handleCreateRoom} className="create-room-form">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Room name"
            className="create-room-input"
            maxLength={20}
            autoFocus
          />
          <button type="submit" className="create-room-submit">
            Create
          </button>
        </form>
      )}

      <div className="rooms">
        {rooms.map((room) => {
          const unreadCount = unreadCounts[room] || 0;
          return (
            <button
              key={room}
              className={`room-item ${room === currentRoom ? 'active' : ''}`}
              onClick={() => onRoomChange(room)}
            >
              <span className="room-name"># {room}</span>
              {unreadCount > 0 && (
                <span className="unread-badge">{unreadCount}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default RoomList;

