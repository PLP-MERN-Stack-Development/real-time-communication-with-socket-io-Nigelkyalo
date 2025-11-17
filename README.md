# 💬 Real-Time Chat Application with Socket.io

A fully-featured real-time chat application built with React, Node.js, Express, and Socket.io. This application demonstrates bidirectional communication, multiple chat rooms, private messaging, and advanced features like reactions, read receipts, and notifications.

## ✨ Features

### Core Features
- ✅ **Real-time Messaging**: Instant message delivery using Socket.io
- ✅ **User Authentication**: Simple username-based authentication
- ✅ **Multiple Chat Rooms**: Create and join different chat rooms
- ✅ **Private Messaging**: Send direct messages to other users
- ✅ **Online/Offline Status**: See who's online in real-time
- ✅ **Typing Indicators**: Know when someone is typing
- ✅ **Message Timestamps**: See when messages were sent

### Advanced Features
- ✅ **Message Reactions**: React to messages with emojis (👍, ❤️, 😂, 😮, 😢, 🔥)
- ✅ **Read Receipts**: See when your messages have been read
- ✅ **File/Image Sharing**: Share images and files in chat
- ✅ **Message Search**: Search through message history
- ✅ **Message Pagination**: Load older messages on scroll
- ✅ **Unread Message Counts**: Track unread messages per room
- ✅ **Browser Notifications**: Get notified of new messages
- ✅ **Sound Notifications**: Audio alerts for new messages
- ✅ **Reconnection Logic**: Automatic reconnection on disconnect
- ✅ **Responsive Design**: Works on desktop and mobile devices

## ✅ Assignment Task Completion Checklist

### Task 1: Project Setup ✅
- ✅ Node.js server with Express
- ✅ Socket.io configured on server side
- ✅ React front-end application created
- ✅ Socket.io client set up in React app
- ✅ Basic connection established between client and server

### Task 2: Core Chat Functionality ✅
- ✅ User authentication (username-based)
- ✅ Global chat room for all users
- ✅ Messages display with sender's name and timestamp
- ✅ Typing indicators when user is composing
- ✅ Online/offline status for users

### Task 3: Advanced Chat Features ✅
- ✅ Private messaging between users
- ✅ Multiple chat rooms/channels
- ✅ "User is typing" indicator
- ✅ File/image sharing enabled
- ✅ Read receipts for messages
- ✅ Message reactions (like, love, etc.)

### Task 4: Real-Time Notifications ✅
- ✅ Notifications when user receives new message
- ✅ Notifications when user joins/leaves chat room
- ✅ Unread message count display
- ✅ Sound notifications for new messages
- ✅ Browser notifications (Web Notifications API)

### Task 5: Performance and UX Optimization ✅
- ✅ Message pagination for loading older messages
- ✅ Reconnection logic for handling disconnections
- ✅ Socket.io optimized with rooms
- ✅ Message delivery acknowledgment (read receipts)
- ✅ Message search functionality
- ✅ Responsive design for desktop and mobile

### Submission Requirements ✅
- ✅ Complete client and server code
- ✅ Comprehensive README.md with:
  - ✅ Project overview
  - ✅ Setup instructions
  - ✅ Features implemented
  - 📸 Screenshots section (ready for images)
- 🚀 Deployment instructions provided (optional)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd real-time-communication-with-socket-io-Nigelkyalo
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the server**
   ```bash
   cd server
   npm run dev
   ```
   The server will run on `http://localhost:3000`

2. **Start the client** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173` and enter a username to start chatting!

## 📁 Project Structure

```
real-time-communication-with-socket-io-Nigelkyalo/
├── client/                      # React front-end
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Chat.jsx         # Main chat component
│   │   │   ├── Login.jsx        # Login screen
│   │   │   ├── MessageList.jsx  # Message display
│   │   │   ├── Message.jsx      # Individual message
│   │   │   ├── MessageInput.jsx # Message input
│   │   │   ├── UserList.jsx     # Online users
│   │   │   ├── RoomList.jsx     # Chat rooms
│   │   │   └── SearchBar.jsx    # Message search
│   │   ├── socket/
│   │   │   └── socket.js        # Socket.io client setup
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── package.json
│   └── vite.config.js
├── server/                      # Node.js back-end
│   ├── server.js               # Main server file
│   └── package.json
├── README.md
└── Week5-Assignment.md
```

## 🎯 Features in Detail

### 1. Real-Time Messaging
- Messages are instantly delivered to all users in the same room
- Messages are stored in memory (up to 500 per room)
- Messages include sender name, timestamp, and unique ID

### 2. Multiple Chat Rooms
- Default "general" room is available
- Users can create new rooms
- Switch between rooms seamlessly
- Each room maintains its own message history

### 3. Private Messaging
- Click on any user in the user list to send a private message
- Private messages are only visible to sender and recipient
- Unread count tracking for private messages

### 4. Typing Indicators
- Shows when users are typing in real-time
- Automatically clears after 3 seconds of inactivity
- Room-specific typing indicators

### 5. Message Reactions
- React to any message with emojis
- See who reacted to messages
- Toggle reactions on/off
- Reaction counts displayed

### 6. Read Receipts
- Messages show when they've been read
- Click on messages to mark them as read
- Read status updates in real-time

### 7. File/Image Sharing
- Upload images and files
- Images are displayed inline
- Files show download links
- Base64 encoding for file transfer

### 8. Message Search
- Search through message history
- Search results show sender, message, and timestamp
- Room-specific search

### 9. Notifications
- Browser notifications for new messages (requires permission)
- Sound notifications for new messages
- Unread message counts per room
- Notifications only when not in the active room

### 10. Reconnection
- Automatic reconnection on disconnect
- Exponential backoff for reconnection attempts
- Connection status indicator
- Seamless rejoin of rooms

## 🛠️ Technology Stack

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Socket.io Client**: Real-time communication
- **CSS3**: Styling with modern features

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **Socket.io**: Real-time bidirectional communication
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## 📝 API Endpoints

### REST API
- `GET /` - Server status
- `GET /api/messages/:roomId` - Get messages for a room (with pagination)
- `GET /api/rooms` - Get list of all rooms
- `GET /api/users` - Get all connected users
- `GET /api/users/:roomId` - Get users in a specific room

### Socket.io Events

#### Client → Server
- `user_join` - Join chat with username
- `join_room` - Join a specific room
- `create_room` - Create a new room
- `send_message` - Send a message
- `private_message` - Send private message
- `typing` - Update typing status
- `add_reaction` - Add reaction to message
- `remove_reaction` - Remove reaction from message
- `mark_read` - Mark message as read
- `search_messages` - Search messages
- `get_messages` - Get paginated messages
- `clear_unread` - Clear unread count

#### Server → Client
- `connect` - Connection established
- `disconnect` - Connection lost
- `receive_message` - New message received
- `private_message` - Private message received
- `user_list` - Updated user list
- `user_joined` - User joined notification
- `user_left` - User left notification
- `room_list` - Updated room list
- `typing_users` - Users currently typing
- `reaction_added` - Reaction added to message
- `reaction_removed` - Reaction removed from message
- `message_read` - Message marked as read
- `search_results` - Search results
- `unread_update` - Unread count update
- `message_history` - Message history on join
- `paginated_messages` - Paginated messages

## 🎨 UI/UX Features

- **Modern Design**: Clean, gradient-based design
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Transitions and hover effects
- **Color-Coded Messages**: Own messages vs others
- **Status Indicators**: Connection status, online users
- **Intuitive Navigation**: Easy room switching and user interaction

## 🔒 Security Considerations

- Input validation on client and server
- Message length limits (1000 characters)
- Username length limits (20 characters)
- File size considerations (base64 encoding)
- CORS configuration for production
- Environment variables for configuration

## 🚀 Deployment

### Server Deployment

#### Option 1: Render
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the root directory to `server`
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables:
   - `PORT`: 3000 (or let Render assign)
   - `CLIENT_URL`: Your client deployment URL
   - `NODE_ENV`: production

#### Option 2: Railway
1. Create a new project on Railway
2. Connect your GitHub repository
3. Add a new service and select the `server` directory
4. Railway will auto-detect Node.js
5. Add environment variables:
   - `CLIENT_URL`: Your client deployment URL
   - `NODE_ENV`: production

#### Option 3: Heroku
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set CLIENT_URL=https://your-client-url.com
   heroku config:set NODE_ENV=production
   ```
5. Deploy:
   ```bash
   cd server
   git subtree push --prefix . heroku main
   ```

### Client Deployment

#### Option 1: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to client directory: `cd client`
3. Build: `npm run build`
4. Deploy: `vercel`
5. Set environment variable:
   - `VITE_SOCKET_URL`: Your server URL (e.g., `https://your-server.onrender.com`)

#### Option 2: Netlify
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Navigate to client directory: `cd client`
3. Build: `npm run build`
4. Deploy: `netlify deploy --prod --dir=dist`
5. Set environment variable in Netlify dashboard:
   - `VITE_SOCKET_URL`: Your server URL

#### Option 3: GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/real-time-communication-with-socket-io-Nigelkyalo",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Deploy: `npm run deploy`

### Post-Deployment

After deploying both server and client:

1. Update server's `CLIENT_URL` environment variable to your client URL
2. Update client's `VITE_SOCKET_URL` environment variable to your server URL
3. Rebuild and redeploy both applications
4. Add your deployed URLs to this README:

**Live Demo:**
- Client: [Your Client URL]
- Server: [Your Server URL]

### Environment Variables Summary

**Server (.env):**
```env
PORT=3000
CLIENT_URL=https://your-client-url.vercel.app
NODE_ENV=production
```

**Client (.env):**
```env
VITE_SOCKET_URL=https://your-server.onrender.com
```

## 📸 Screenshots

To add screenshots of your application:

1. Take screenshots of key features:
   - Login screen
   - Main chat interface
   - Multiple rooms
   - Private messaging
   - Message reactions
   - Typing indicators
   - Mobile responsive view

2. Save screenshots in a `screenshots/` folder in the root directory

3. Add them to this section using markdown:
   ```markdown
   ### Login Screen
   ![Login Screen](./screenshots/login.png)
   
   ### Chat Interface
   ![Chat Interface](./screenshots/chat.png)
   
   ### Multiple Rooms
   ![Multiple Rooms](./screenshots/rooms.png)
   ```

**Example Screenshots to Include:**
- Login/Username entry screen
- Main chat interface showing messages
- Room switching functionality
- Private messaging interface
- Message reactions in action
- Typing indicators
- Mobile responsive design
- Search functionality
- File/image sharing

## 🐛 Known Issues / Future Improvements

- [ ] Persistent message storage (database integration)
- [ ] User authentication with JWT
- [ ] Message editing and deletion
- [ ] Voice/video calling
- [ ] Message encryption
- [ ] User profiles and avatars
- [ ] Message threading
- [ ] Rich text formatting
- [ ] GIF support
- [ ] Message pinning

## 📚 Additional Resources

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Deployment Guide](./DEPLOYMENT.md) - Detailed deployment instructions

## 👤 Author

Nigel Kyalo

## 📄 License

This project is part of a course assignment.

---

**Note**: This application is for educational purposes. For production use, consider adding authentication, database persistence, and additional security measures. 