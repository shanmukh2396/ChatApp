const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// Map to track active connected users: Map<userId, Set<socketId>>
const activeUsers = new Map();

const initSocket = (httpServer) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://chat-app-six-delta-29.vercel.app',
  ];

  if (process.env.CLIENT_URL) {
    process.env.CLIENT_URL.split(',').forEach((url) => {
      const trimmed = url.trim().replace(/\/+$/, '');
      if (trimmed && !allowedOrigins.includes(trimmed)) {
        allowedOrigins.push(trimmed);
      }
    });
  }

  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const isExplicitlyAllowed = allowedOrigins.includes(origin);
        const isVercel = /^https:\/\/.*\.vercel\.app$/.test(origin);
        if (isExplicitlyAllowed || isVercel) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
  });

  // ─── Authentication Middleware ─────────────────────────────────────────────
  io.use((socket, next) => {
    // Check ticket, token from handshake auth or Authorization header
    let token =
      socket.handshake.auth?.ticket ||
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace(/^Bearer\s+/, '');

    if (!token && socket.handshake.headers?.cookie) {
      const match = socket.handshake.headers.cookie.match(/(?:^|;\s*)jwt=([^;]*)/);
      if (match) token = match[1];
    }

    if (!token) {
      return next(new Error('Authentication token missing'));
    }

    try {
      // First try ticket secret or fallback to standard JWT secret
      let decoded;
      try {
        decoded = jwt.verify(
          token,
          process.env.SOCKET_TICKET_SECRET || process.env.JWT_SECRET
        );
      } catch (e) {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      }

      socket.userId = decoded.userId;
      next();
    } catch (err) {
      return next(new Error('Invalid or expired authentication ticket'));
    }
  });

  // ─── Connection Handler ───────────────────────────────────────────────────
  io.on('connection', async (socket) => {
    const userId = socket.userId;

    // Join personal user room for direct user-level events
    socket.join(userId);

    // Track active connection
    if (!activeUsers.has(userId)) {
      activeUsers.set(userId, new Set());
    }
    activeUsers.get(userId).add(socket.id);

    // Mark user as online in DB & broadcast presence
    try {
      await User.findByIdAndUpdate(userId, { isOnline: true });
      io.emit('user_status', { userId, isOnline: true });
    } catch (err) {
      console.error('Error updating user online status:', err);
    }

    // ─── Join / Leave Conversation Room ─────────────────────────────────────
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('leave_conversation', (conversationId) => {
      socket.leave(conversationId);
    });

    // ─── Real-time Messaging ────────────────────────────────────────────────
    socket.on('send_message', (data) => {
      const { conversationId, message } = data;
      if (conversationId && message) {
        // Broadcast to everyone in the conversation room including sender's other tabs
        io.to(conversationId).emit('new_message', message);
      }
    });

    // ─── Typing Indicators ──────────────────────────────────────────────────
    socket.on('typing', ({ conversationId, userName }) => {
      socket.to(conversationId).emit('typing_indicator', {
        conversationId,
        userId,
        userName,
        isTyping: true,
      });
    });

    socket.on('stop_typing', ({ conversationId }) => {
      socket.to(conversationId).emit('typing_indicator', {
        conversationId,
        userId,
        isTyping: false,
      });
    });

    // ─── Read Receipts ──────────────────────────────────────────────────────
    socket.on('mark_read', ({ conversationId }) => {
      socket.to(conversationId).emit('messages_read', {
        conversationId,
        readerId: userId,
        readAt: new Date(),
      });
    });

    // ─── WebRTC Call Signaling (1-to-1 Voice & Video) ────────────────────────
    socket.on('call_user', (data) => {
      const { receiverId, callerName, callerAvatar, callType, offer } = data;
      if (receiverId) {
        io.to(receiverId).emit('incoming_call', {
          callerId: userId,
          callerName,
          callerAvatar,
          callType, // 'voice' | 'video'
          offer,
        });
      }
    });

    socket.on('call_accepted', (data) => {
      const { callerId, answer } = data;
      if (callerId) {
        io.to(callerId).emit('call_accepted', {
          receiverId: userId,
          answer,
        });
      }
    });

    socket.on('call_declined', (data) => {
      const { callerId, reason } = data;
      if (callerId) {
        io.to(callerId).emit('call_declined', {
          receiverId: userId,
          reason: reason || 'Call declined',
        });
      }
    });

    socket.on('call_ended', (data) => {
      const { partnerId } = data;
      if (partnerId) {
        io.to(partnerId).emit('call_ended', {
          senderId: userId,
        });
      }
    });

    socket.on('ice_candidate', (data) => {
      const { targetUserId, candidate } = data;
      if (targetUserId && candidate) {
        io.to(targetUserId).emit('ice_candidate', {
          candidate,
          fromUserId: userId,
        });
      }
    });

    // ─── Disconnect ─────────────────────────────────────────────────────────
    socket.on('disconnect', async () => {
      if (activeUsers.has(userId)) {
        const userSockets = activeUsers.get(userId);
        userSockets.delete(socket.id);

        // If no more open tabs/connections for this user, mark as offline
        if (userSockets.size === 0) {
          activeUsers.delete(userId);
          const now = new Date();
          try {
            await User.findByIdAndUpdate(userId, {
              isOnline: false,
              lastSeen: now,
            });
            io.emit('user_status', { userId, isOnline: false, lastSeen: now });
          } catch (err) {
            console.error('Error updating offline status:', err);
          }
        }
      }
    });
  });

  return io;
};

module.exports = { initSocket };
