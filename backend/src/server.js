require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./sockets/socket');

const PORT = process.env.PORT || 5000;

// ─── HTTP Server ──────────────────────────────────────────────────────────────
const server = http.createServer(app);

// ─── Socket.IO Initialization ────────────────────────────────────────────────
const io = initSocket(server);

// Attach io to app so routes can access it if needed (req.app.get('io'))
app.set('io', io);

// ─── Graceful Shutdown ───────────────────────────────────────────────────────
const shutdown = (signal) => {
  console.log(`\n⚠️  Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('✅ HTTP and WebSocket server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// ─── Boot ─────────────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`   Environment : ${process.env.NODE_ENV}`);
    console.log(`   Client URL  : ${process.env.CLIENT_URL}`);
  });
};

start();

module.exports = { server, io };
