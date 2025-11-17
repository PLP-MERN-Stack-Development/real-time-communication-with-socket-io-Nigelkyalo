import { useState, useRef } from 'react';
import { useSocket } from '../socket/socket';
import './MessageInput.css';

function MessageInput({ currentRoom }) {
  const { sendMessage, setTyping, socket } = useSocket();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (!isTyping && value.trim()) {
      setIsTyping(true);
      setTyping(true, currentRoom);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setTyping(false, currentRoom);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim(), null);
      setInput('');
      setIsTyping(false);
      setTyping(false, currentRoom);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: event.target.result,
      };

      if (file.type.startsWith('image/')) {
        sendMessage(`Shared an image: ${file.name}`, fileData);
      } else {
        sendMessage(`Shared a file: ${file.name}`, fileData);
      }
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="message-input-form">
        <button
          type="button"
          className="file-button"
          onClick={() => fileInputRef.current?.click()}
          title="Attach file"
        >
          📎
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="image/*,application/pdf,.doc,.docx"
        />
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="message-input"
          maxLength={1000}
        />
        <button type="submit" className="send-button" disabled={!input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default MessageInput;

