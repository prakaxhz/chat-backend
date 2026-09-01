const jwt = require('jsonwebtoken');
const User = require('../modules/users/models/user.model');
const config = require('../config/env');

/**
 * Socket.io middleware for JWT authentication
 */
const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication error: Token not provided'));
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new Error('Authentication error: User no longer exists'));
    }

    // Check if user changed password after the token was issued
    if (currentUser.password_changed_at) {
      const changedTimestamp = parseInt(currentUser.password_changed_at.getTime() / 1000, 10);
      if (decoded.iat < changedTimestamp) {
        return next(new Error('Authentication error: Token expired due to password change'));
      }
    }

    // Attach user to socket
    socket.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new Error('Authentication error: Token expired'));
    }
    return next(new Error('Authentication error: Invalid token'));
  }
};

module.exports = socketAuthMiddleware;

