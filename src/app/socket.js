const { Server } = require('socket.io');
const socketAuthMiddleware = require('../middleware/socketAuth.middleware');
const socketConfig = require('../config/socket');

let io;

const initializeSocket = (server) => {
  // Pass the extracted configuration options
  io = new Server(server, socketConfig);

  // Add authentication middleware for socket
  io.use(socketAuthMiddleware);

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.id})`);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name} (${socket.id})`);
    });

    // Custom events can be registered here
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIo
};

