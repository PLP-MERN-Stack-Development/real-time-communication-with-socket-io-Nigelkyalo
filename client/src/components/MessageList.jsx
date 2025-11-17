import { useEffect, useRef, useState } from 'react';
import Message from './Message';
import { useSocket } from '../socket/socket';
import './MessageList.css';

function MessageList({ messages, currentUsername, typingUsers, messagesEndRef }) {
  const { getMessages, currentRoom } = useSocket();
  const messagesContainerRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const loadingRef = useRef(false);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop === 0 && hasMore && !loadingRef.current) {
        loadingRef.current = true;
        const nextPage = page + 1;
        getMessages(nextPage, 50, currentRoom);
        setPage(nextPage);
        setTimeout(() => {
          loadingRef.current = false;
        }, 1000);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, page, currentRoom, getMessages]);

  return (
    <div className="message-list" ref={messagesContainerRef}>
      {messages.length === 0 ? (
        <div className="empty-messages">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((message) => {
          const isOwn = message.sender === currentUsername;
          return (
            <Message
              key={message.id}
              message={message}
              isOwn={isOwn}
              currentUsername={currentUsername}
            />
          );
        })
      )}

      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          <span>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;

