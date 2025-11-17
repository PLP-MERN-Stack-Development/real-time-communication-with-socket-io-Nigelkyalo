# 🚀 Deployment Guide

This guide provides step-by-step instructions for deploying the Real-Time Chat Application.

## Prerequisites

- GitHub account with repository pushed
- Account on deployment platforms (Render, Railway, Vercel, Netlify, etc.)

## Server Deployment

### Render (Recommended)

1. **Create Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
   - **Name**: `socketio-chat-server` (or your choice)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Set Environment Variables**
   - `CLIENT_URL`: Your client URL (set after client deployment)
   - `NODE_ENV`: `production`
   - `PORT`: `3000` (optional, Render assigns automatically)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the service URL (e.g., `https://your-app.onrender.com`)

### Railway

1. **Create Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**
   - Railway auto-detects Node.js
   - Set root directory to `server` in settings
   - Add environment variables:
     - `CLIENT_URL`: Your client URL
     - `NODE_ENV`: `production`

4. **Deploy**
   - Railway automatically deploys on push
   - Get your service URL from the dashboard

### Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   heroku create your-app-name
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set CLIENT_URL=https://your-client-url.com
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   cd server
   git subtree push --prefix . heroku main
   ```

## Client Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd client
   vercel
   ```
   - Follow prompts
   - Set root directory to `client`
   - Build command: `npm run build`
   - Output directory: `dist`

4. **Set Environment Variable**
   - Go to Vercel dashboard → Your project → Settings → Environment Variables
   - Add: `VITE_SOCKET_URL` = Your server URL

5. **Redeploy**
   - After setting environment variable, trigger a new deployment

### Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Build**
   ```bash
   cd client
   npm run build
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
   ```

5. **Set Environment Variable**
   - Go to Netlify dashboard → Site settings → Environment variables
   - Add: `VITE_SOCKET_URL` = Your server URL

6. **Redeploy**
   - Trigger a new deployment from dashboard

### GitHub Pages

1. **Install gh-pages**
   ```bash
   cd client
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/real-time-communication-with-socket-io-Nigelkyalo",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Set Environment Variable**
   - Create `.env.production` file:
   ```
   VITE_SOCKET_URL=https://your-server-url.com
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Select source: `gh-pages` branch
   - Save

## Post-Deployment Checklist

1. ✅ Server deployed and accessible
2. ✅ Client deployed and accessible
3. ✅ Server `CLIENT_URL` set to client URL
4. ✅ Client `VITE_SOCKET_URL` set to server URL
5. ✅ Both applications redeployed with correct URLs
6. ✅ Test connection between client and server
7. ✅ Test all features in production
8. ✅ Add deployed URLs to README.md

## Troubleshooting

### CORS Errors
- Ensure `CLIENT_URL` in server matches your client deployment URL exactly
- Check for trailing slashes
- Verify HTTPS/HTTP matches

### Connection Issues
- Verify `VITE_SOCKET_URL` is set correctly in client
- Check server logs for connection attempts
- Ensure WebSocket connections are allowed by hosting provider

### Build Failures
- Check Node.js version (v18+ required)
- Verify all dependencies are in package.json
- Check build logs for specific errors

## Environment Variables Reference

### Server
```env
PORT=3000
CLIENT_URL=https://your-client.vercel.app
NODE_ENV=production
```

### Client
```env
VITE_SOCKET_URL=https://your-server.onrender.com
```

## Support

For issues with deployment:
1. Check platform-specific documentation
2. Review server/client logs
3. Verify environment variables are set correctly
4. Test locally first before deploying

