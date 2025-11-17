// server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users and messages
const users = {}; // { socketId: { username, id, currentRoom } }
const messages = {}; // { roomId: [messages] }
const typingUsers = {}; // { roomId: { socketId: username } }
const rooms = new Set(['general']); // Available rooms
const messageReactions = {}; // { messageId: { reaction: [userIds] } }
const readReceipts = {}; // { messageId: { userId: timestamp } }
const unreadCounts = {}; // { userId: { roomId: count } }

// Helper function to initialize room messages
function initRoomMessages(roomId) {
  if (!messages[roomId]) {
    messages[roomId] = [];
  }
}

// Helper function to get room users
function getRoomUsers(roomId) {
  return Object.values(users).filter(user => user.currentRoom === roomId);
}

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('user_join', ({ username, roomId = 'general' }) => {
    // Leave previous room if exists
    if (users[socket.id]?.currentRoom) {
      socket.leave(users[socket.id].currentRoom);
    }

    users[socket.id] = { username, id: socket.id, currentRoom: roomId };
    socket.join(roomId);
    initRoomMessages(roomId);

    // Send room list
    socket.emit('room_list', Array.from(rooms));

    // Send current room users
    const roomUsers = getRoomUsers(roomId);
    io.to(roomId).emit('user_list', roomUsers);
    io.to(roomId).emit('user_joined', { username, id: socket.id, roomId });

    // Send recent messages for the room
    const recentMessages = messages[roomId].slice(-50);
    socket.emit('message_history', recentMessages);

    console.log(`${username} joined room: ${roomId}`);
  });

  // Handle room change
  socket.on('join_room', (roomId) => {
    if (!users[socket.id]) return;

    const oldRoom = users[socket.id].currentRoom;
    socket.leave(oldRoom);
    
    users[socket.id].currentRoom = roomId;
    socket.join(roomId);
    initRoomMessages(roomId);

    // Update user lists
    if (oldRoom) {
      io.to(oldRoom).emit('user_list', getRoomUsers(oldRoom));
    }
    io.to(roomId).emit('user_list', getRoomUsers(roomId));
    io.to(roomId).emit('user_joined', { 
      username: users[socket.id].username, 
      id: socket.id, 
      roomId 
    });

    // Send recent messages
    const recentMessages = messages[roomId].slice(-50);
    socket.emit('message_history', recentMessages);
  });

  // Handle creating new room
  socket.on('create_room', (roomName) => {
    if (!roomName || rooms.has(roomName)) {
      socket.emit('room_error', { message: 'Room already exists or invalid name' });
      return;
    }
    rooms.add(roomName);
    io.emit('room_list', Array.from(rooms));
    socket.emit('room_created', roomName);
  });

  // Handle chat messages
  socket.on('send_message', (messageData) => {
    if (!users[socket.id]) return;

    const user = users[socket.id];
    const roomId = user.currentRoom || 'general';
    initRoomMessages(roomId);

    const message = {
      ...messageData,
      id: uuidv4(),
      sender: user.username,
      senderId: socket.id,
      roomId,
      timestamp: new Date().toISOString(),
      reactions: {},
      readBy: {},
    };
    
    messages[roomId].push(message);
    
    // Limit stored messages per room
    if (messages[roomId].length > 500) {
      messages[roomId].shift();
    }
    
    // Emit to room
    io.to(roomId).emit('receive_message', message);

    // Update unread counts for users not in the room
    Object.keys(users).forEach(userSocketId => {
      if (users[userSocketId].currentRoom !== roomId && userSocketId !== socket.id) {
        if (!unreadCounts[userSocketId]) unreadCounts[userSocketId] = {};
        if (!unreadCounts[userSocketId][roomId]) unreadCounts[userSocketId][roomId] = 0;
        unreadCounts[userSocketId][roomId]++;
        io.to(userSocketId).emit('unread_update', unreadCounts[userSocketId]);
      }
    });
  });

  // Handle typing indicator
  socket.on('typing', ({ isTyping, roomId }) => {
    if (!users[socket.id]) return;

    const username = users[socket.id].username;
    const currentRoom = roomId || users[socket.id].currentRoom || 'general';
    
    if (!typingUsers[currentRoom]) typingUsers[currentRoom] = {};
    
    if (isTyping) {
      typingUsers[currentRoom][socket.id] = username;
    } else {
      delete typingUsers[currentRoom][socket.id];
    }
    
    io.to(currentRoom).emit('typing_users', Object.values(typingUsers[currentRoom] || {}));
  });

  // Handle private messages
  socket.on('private_message', ({ to, message, fileData }) => {
    if (!users[socket.id]) return;

    const messageData = {
      id: uuidv4(),
      sender: users[socket.id].username,
      senderId: socket.id,
      recipientId: to,
      message,
      fileData,
      timestamp: new Date().toISOString(),
      isPrivate: true,
      reactions: {},
      readBy: {},
    };
    
    socket.to(to).emit('private_message', messageData);
    socket.emit('private_message', messageData);

    // Update unread count
    if (!unreadCounts[to]) unreadCounts[to] = {};
    if (!unreadCounts[to].private) unreadCounts[to].private = 0;
    unreadCounts[to].private++;
    io.to(to).emit('unread_update', unreadCounts[to]);
  });

  // Handle message reactions
  socket.on('add_reaction', ({ messageId, reaction, roomId }) => {
    if (!users[socket.id]) return;

    const currentRoom = roomId || users[socket.id].currentRoom || 'general';
    const roomMessages = messages[currentRoom] || [];
    const message = roomMessages.find(m => m.id === messageId);

    if (message) {
      if (!message.reactions) message.reactions = {};
      if (!message.reactions[reaction]) message.reactions[reaction] = [];
      
      if (!message.reactions[reaction].includes(socket.id)) {
        message.reactions[reaction].push(socket.id);
        io.to(currentRoom).emit('reaction_added', { messageId, reaction, userId: socket.id });
      }
    }
  });

  socket.on('remove_reaction', ({ messageId, reaction, roomId }) => {
    if (!users[socket.id]) return;

    const currentRoom = roomId || users[socket.id].currentRoom || 'general';
    const roomMessages = messages[currentRoom] || [];
    const message = roomMessages.find(m => m.id === messageId);

    if (message && message.reactions && message.reactions[reaction]) {
      message.reactions[reaction] = message.reactions[reaction].filter(id => id !== socket.id);
      io.to(currentRoom).emit('reaction_removed', { messageId, reaction, userId: socket.id });
    }
  });

  // Handle read receipts
  socket.on('mark_read', ({ messageId, roomId }) => {
    if (!users[socket.id]) return;

    const currentRoom = roomId || users[socket.id].currentRoom || 'general';
    const roomMessages = messages[currentRoom] || [];
    const message = roomMessages.find(m => m.id === messageId);

    if (message) {
      if (!message.readBy) message.readBy = {};
      message.readBy[socket.id] = new Date().toISOString();
      io.to(currentRoom).emit('message_read', { messageId, userId: socket.id });
    }
  });

  // Handle message search
  socket.on('search_messages', ({ query, roomId }) => {
    if (!users[socket.id]) return;

    const currentRoom = roomId || users[socket.id].currentRoom || 'general';
    const roomMessages = messages[currentRoom] || [];
    const results = roomMessages.filter(msg => 
      msg.message && msg.message.toLowerCase().includes(query.toLowerCase())
    ).slice(-20);

    socket.emit('search_results', results);
  });

  // Handle pagination
  socket.on('get_messages', ({ roomId, page = 0, limit = 50 }) => {
    if (!users[socket.id]) return;

    const currentRoom = roomId || users[socket.id].currentRoom || 'general';
    initRoomMessages(currentRoom);
    
    const start = Math.max(0, messages[currentRoom].length - (page + 1) * limit);
    const end = messages[currentRoom].length - page * limit;
    const paginatedMessages = messages[currentRoom].slice(start, end);

    socket.emit('paginated_messages', {
      messages: paginatedMessages,
      page,
      hasMore: start > 0,
    });
  });

  // Handle clearing unread count
  socket.on('clear_unread', ({ roomId }) => {
    if (!unreadCounts[socket.id]) return;
    
    if (roomId) {
      unreadCounts[socket.id][roomId] = 0;
    } else {
      unreadCounts[socket.id] = {};
    }
    
    socket.emit('unread_update', unreadCounts[socket.id] || {});
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (users[socket.id]) {
      const { username, currentRoom } = users[socket.id];
      
      if (currentRoom) {
        socket.leave(currentRoom);
        io.to(currentRoom).emit('user_left', { username, id: socket.id, roomId: currentRoom });
        io.to(currentRoom).emit('user_list', getRoomUsers(currentRoom));
        
        // Clear typing status
        if (typingUsers[currentRoom]) {
          delete typingUsers[currentRoom][socket.id];
          io.to(currentRoom).emit('typing_users', Object.values(typingUsers[currentRoom] || {}));
        }
      }
      
      console.log(`${username} left the chat`);
    }
    
    delete users[socket.id];
    delete unreadCounts[socket.id];
  });
});

// API routes
app.get('/api/messages/:roomId', (req, res) => {
  const { roomId } = req.params;
  const roomMessages = messages[roomId] || [];
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 50;
  
  const start = Math.max(0, roomMessages.length - (page + 1) * limit);
  const end = roomMessages.length - page * limit;
  
  res.json({
    messages: roomMessages.slice(start, end),
    page,
    total: roomMessages.length,
    hasMore: start > 0,
  });
});

app.get('/api/rooms', (req, res) => {
  res.json(Array.from(rooms));
});

app.get('/api/users/:roomId', (req, res) => {
  const { roomId } = req.params;
  const roomUsers = Object.values(users).filter(user => user.currentRoom === roomId);
  res.json(roomUsers);
});

app.get('/api/users', (req, res) => {
  res.json(Object.values(users));
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Socket.io Chat Server is running',
    version: '1.0.0',
    rooms: Array.from(rooms),
    connectedUsers: Object.keys(users).length,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io }; 