// socket.js - Socket.io client setup

import { io } from 'socket.io-client';
import { useEffect, useState, useCallback, useRef } from 'react';

// Socket.io connection URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

// Create socket instance
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

// Custom hook for using socket.io
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastMessage, setLastMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [rooms, setRooms] = useState(['general']);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [unreadCounts, setUnreadCounts] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const typingTimeoutRef = useRef(null);
  const notificationPermissionRef = useRef(null);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        notificationPermissionRef.current = permission;
      });
    } else if ('Notification' in window) {
      notificationPermissionRef.current = Notification.permission;
    }
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OSdTgwOUKfk8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQUqgc7y2Yk2CBtpvfDknU4MDlCn5PC2YxwGOJHX8sx5LAUkd8fw3ZBAC');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (e) {
      // Ignore audio errors
    }
  }, []);

  // Show browser notification
  const showNotification = useCallback((title, body, icon) => {
    if (notificationPermissionRef.current === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: icon || '/favicon.ico',
          badge: '/favicon.ico',
        });
      } catch (e) {
        // Ignore notification errors
      }
    }
  }, []);

  // Connect to socket server
  const connect = useCallback((username, roomId = 'general') => {
    socket.connect();
    if (username) {
      socket.emit('user_join', { username, roomId });
      setCurrentRoom(roomId);
    }
  }, []);

  // Disconnect from socket server
  const disconnect = useCallback(() => {
    socket.disconnect();
  }, []);

  // Join a room
  const joinRoom = useCallback((roomId) => {
    socket.emit('join_room', roomId);
    setCurrentRoom(roomId);
    setMessages([]);
  }, []);

  // Create a new room
  const createRoom = useCallback((roomName) => {
    socket.emit('create_room', roomName);
  }, []);

  // Send a message
  const sendMessage = useCallback((message, fileData = null) => {
    socket.emit('send_message', { message, fileData });
  }, []);

  // Send a private message
  const sendPrivateMessage = useCallback((to, message, fileData = null) => {
    socket.emit('private_message', { to, message, fileData });
  }, []);

  // Set typing status with debounce
  const setTyping = useCallback((isTyping, roomId = null) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socket.emit('typing', { isTyping, roomId: roomId || currentRoom });

    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', { isTyping: false, roomId: roomId || currentRoom });
      }, 3000);
    }
  }, [currentRoom]);

  // Add reaction to message
  const addReaction = useCallback((messageId, reaction, roomId = null) => {
    socket.emit('add_reaction', { messageId, reaction, roomId: roomId || currentRoom });
  }, [currentRoom]);

  // Remove reaction from message
  const removeReaction = useCallback((messageId, reaction, roomId = null) => {
    socket.emit('remove_reaction', { messageId, reaction, roomId: roomId || currentRoom });
  }, [currentRoom]);

  // Mark message as read
  const markRead = useCallback((messageId, roomId = null) => {
    socket.emit('mark_read', { messageId, roomId: roomId || currentRoom });
  }, [currentRoom]);

  // Search messages
  const searchMessages = useCallback((query, roomId = null) => {
    socket.emit('search_messages', { query, roomId: roomId || currentRoom });
  }, [currentRoom]);

  // Get paginated messages
  const getMessages = useCallback((page = 0, limit = 50, roomId = null) => {
    socket.emit('get_messages', { roomId: roomId || currentRoom, page, limit });
  }, [currentRoom]);

  // Clear unread count
  const clearUnread = useCallback((roomId = null) => {
    socket.emit('clear_unread', { roomId });
  }, []);

  // Socket event listeners
  useEffect(() => {
    // Connection events
    const onConnect = () => {
      setIsConnected(true);
      console.log('Connected to server');
    };

    const onDisconnect = (reason) => {
      setIsConnected(false);
      console.log('Disconnected from server:', reason);
    };

    const onReconnect = (attemptNumber) => {
      console.log('Reconnected after', attemptNumber, 'attempts');
    };

    const onReconnectAttempt = () => {
      console.log('Attempting to reconnect...');
    };

    // Message events
    const onReceiveMessage = (message) => {
      setLastMessage(message);
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });

      // Show notification if not from current user and not in current room
      if (message.senderId !== socket.id) {
        if (message.isPrivate || message.roomId === currentRoom) {
          playNotificationSound();
          showNotification(
            message.isPrivate ? `Private message from ${message.sender}` : 'New message',
            message.message || 'Sent a file',
            null
          );
        }
      }
    };

    const onPrivateMessage = (message) => {
      setLastMessage(message);
      setMessages((prev) => {
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });

      if (message.senderId !== socket.id) {
        playNotificationSound();
        showNotification(
          `Private message from ${message.sender}`,
          message.message || 'Sent a file',
          null
        );
      }
    };

    const onMessageHistory = (historyMessages) => {
      setMessages(historyMessages);
    };

    const onPaginatedMessages = ({ messages: paginatedMessages, page, hasMore }) => {
      if (page === 0) {
        setMessages(paginatedMessages);
      } else {
        setMessages((prev) => [...paginatedMessages, ...prev]);
      }
    };

    // User events
    const onUserList = (userList) => {
      setUsers(userList);
    };

    const onUserJoined = (user) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          system: true,
          message: `${user.username} joined the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    const onUserLeft = (user) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          system: true,
          message: `${user.username} left the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    // Room events
    const onRoomList = (roomList) => {
      setRooms(roomList);
    };

    const onRoomCreated = (roomName) => {
      setRooms((prev) => [...prev, roomName]);
    };

    const onRoomError = (error) => {
      console.error('Room error:', error);
    };

    // Typing events
    const onTypingUsers = (users) => {
      setTypingUsers(users);
    };

    // Reaction events
    const onReactionAdded = ({ messageId, reaction, userId }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId) {
            const newReactions = { ...msg.reactions };
            if (!newReactions[reaction]) newReactions[reaction] = [];
            if (!newReactions[reaction].includes(userId)) {
              newReactions[reaction] = [...newReactions[reaction], userId];
            }
            return { ...msg, reactions: newReactions };
          }
          return msg;
        })
      );
    };

    const onReactionRemoved = ({ messageId, reaction, userId }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId) {
            const newReactions = { ...msg.reactions };
            if (newReactions[reaction]) {
              newReactions[reaction] = newReactions[reaction].filter((id) => id !== userId);
            }
            return { ...msg, reactions: newReactions };
          }
          return msg;
        })
      );
    };

    // Read receipt events
    const onMessageRead = ({ messageId, userId }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId) {
            const newReadBy = { ...msg.readBy };
            newReadBy[userId] = new Date().toISOString();
            return { ...msg, readBy: newReadBy };
          }
          return msg;
        })
      );
    };

    // Search events
    const onSearchResults = (results) => {
      setSearchResults(results);
    };

    // Unread count events
    const onUnreadUpdate = (counts) => {
      setUnreadCounts(counts);
    };

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('reconnect', onReconnect);
    socket.on('reconnect_attempt', onReconnectAttempt);
    socket.on('receive_message', onReceiveMessage);
    socket.on('private_message', onPrivateMessage);
    socket.on('message_history', onMessageHistory);
    socket.on('paginated_messages', onPaginatedMessages);
    socket.on('user_list', onUserList);
    socket.on('user_joined', onUserJoined);
    socket.on('user_left', onUserLeft);
    socket.on('room_list', onRoomList);
    socket.on('room_created', onRoomCreated);
    socket.on('room_error', onRoomError);
    socket.on('typing_users', onTypingUsers);
    socket.on('reaction_added', onReactionAdded);
    socket.on('reaction_removed', onReactionRemoved);
    socket.on('message_read', onMessageRead);
    socket.on('search_results', onSearchResults);
    socket.on('unread_update', onUnreadUpdate);

    // Clean up event listeners
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('reconnect', onReconnect);
      socket.off('reconnect_attempt', onReconnectAttempt);
      socket.off('receive_message', onReceiveMessage);
      socket.off('private_message', onPrivateMessage);
      socket.off('message_history', onMessageHistory);
      socket.off('paginated_messages', onPaginatedMessages);
      socket.off('user_list', onUserList);
      socket.off('user_joined', onUserJoined);
      socket.off('user_left', onUserLeft);
      socket.off('room_list', onRoomList);
      socket.off('room_created', onRoomCreated);
      socket.off('room_error', onRoomError);
      socket.off('typing_users', onTypingUsers);
      socket.off('reaction_added', onReactionAdded);
      socket.off('reaction_removed', onReactionRemoved);
      socket.off('message_read', onMessageRead);
      socket.off('search_results', onSearchResults);
      socket.off('unread_update', onUnreadUpdate);
    };
  }, [currentRoom, playNotificationSound, showNotification]);

  return {
    socket,
    isConnected,
    lastMessage,
    messages,
    users,
    typingUsers,
    rooms,
    currentRoom,
    unreadCounts,
    searchResults,
    connect,
    disconnect,
    joinRoom,
    createRoom,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    addReaction,
    removeReaction,
    markRead,
    searchMessages,
    getMessages,
    clearUnread,
  };
};

export default socket; 