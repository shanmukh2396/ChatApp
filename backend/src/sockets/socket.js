const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// Map to track active connected users: Map<userId, Set<socketId>>
const activeUsers = new Map();

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
  });

  // ─── Authentication Middleware ─────────────────────────────────────────────
  io.use((socket, next) => {
    const ticket = socket.handshake.auth?.ticket;

    if (!ticket) {
      return next(new Error('Authentication ticket missing'));
    }

    try {
      const decoded = jwt.verify(
        ticket,
        process.env.SOCKET_TICKET_SECRET || process.env.JWT_SECRET
      );
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
