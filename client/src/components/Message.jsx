import { useState } from 'react';
import { useSocket } from '../socket/socket';
import './Message.css';

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

function Message({ message, isOwn, currentUsername }) {
  const { addReaction, removeReaction, markRead, socket } = useSocket();
  const [showReactions, setShowReactions] = useState(false);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleReaction = (reaction) => {
    if (!message.reactions || !message.reactions[reaction]) {
      addReaction(message.id, reaction, message.roomId);
    } else {
      // Check if current user has reacted by checking if their socket.id is in the array
      const hasReacted = message.reactions[reaction].includes(socket.id);
      if (hasReacted) {
        removeReaction(message.id, reaction, message.roomId);
      } else {
        addReaction(message.id, reaction, message.roomId);
      }
    }
    setShowReactions(false);
  };

  const handleMessageClick = () => {
    if (!isOwn && message.id && message.roomId) {
      markRead(message.id, message.roomId);
    }
  };

  if (message.system) {
    return (
      <div className="message system-message">
        <span>{message.message}</span>
      </div>
    );
  }

  const hasReacted = (reaction) => {
    if (!message.reactions || !message.reactions[reaction]) return false;
    return message.reactions[reaction].includes(socket.id);
  };

  return (
    <div
      className={`message ${isOwn ? 'own-message' : 'other-message'}`}
      onClick={handleMessageClick}
    >
      {!isOwn && (
        <div className="message-sender">{message.sender}</div>
      )}

      <div className="message-content">
        {message.fileData ? (
          <div className="message-file">
            {message.fileData.type?.startsWith('image/') ? (
              <img src={message.fileData.data} alt="Shared" className="message-image" />
            ) : (
              <div className="message-file-info">
                <span>📎 {message.fileData.name || 'File'}</span>
                <a href={message.fileData.data} download target="_blank" rel="noreferrer">
                  Download
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="message-text">{message.message}</div>
        )}

        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className="message-reactions">
            {Object.entries(message.reactions).map(([reaction, userIds]) => (
              <button
                key={reaction}
                className={`reaction-button ${hasReacted(reaction) ? 'reacted' : ''}`}
                onClick={() => handleReaction(reaction)}
                title={userIds.length > 0 ? `${userIds.length} reaction(s)` : ''}
              >
                {reaction} {userIds.length > 0 && <span>{userIds.length}</span>}
              </button>
            ))}
          </div>
        )}

        <div className="message-footer">
          <span className="message-time">{formatTime(message.timestamp)}</span>
          {isOwn && message.readBy && Object.keys(message.readBy).length > 0 && (
            <span className="read-receipt">✓ Read</span>
          )}
        </div>
      </div>

      <div className="message-actions">
        <button
          className="reaction-trigger"
          onClick={() => setShowReactions(!showReactions)}
        >
          😀
        </button>
        {showReactions && (
          <div className="reaction-picker">
            {REACTIONS.map((reaction) => (
              <button
                key={reaction}
                className="reaction-option"
                onClick={() => handleReaction(reaction)}
              >
                {reaction}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;

