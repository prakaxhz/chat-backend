// src/config/socket.js
// Centralized configuration for Socket.io

const envConfig = require('./env');

const socketConfig = {
  cors: {
    origin: '*', // In production, replace with envConfig.frontendUrl or similar
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  // Later on, if you decide to use Redis for scaling WebSockets across multiple servers:
  // adapter: createAdapter(pubClient, subClient)
};

module.exports = socketConfig;

