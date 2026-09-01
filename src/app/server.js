const http = require('http');
const app = require('./app');
const connectDatabase = require('../config/database');
const config = require('../config/env');

const PORT = config.port;

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSockets
const { initializeSocket } = require('./socket');
const io = initializeSocket(server);

// Connect to database and start server
connectDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});

