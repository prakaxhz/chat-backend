const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const User = require('../modules/users/models/user.model');
const config = require('../config/env');
const ApiError = require('../shared/utils/ApiError');
const asyncHandler = require('../shared/utils/asyncHandler');

/**
 * Middleware to protect routes by verifying JWT token
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if token exists in cookies OR headers (fallback)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token || token === 'none') {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      'You are not logged in! Please log in to get access.'
    );
  }

  // 2. Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      'Invalid or expired token.');
  }

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      'The user belonging to this token does no longer exist.'
    );
  }

  // 4. Check if user changed password after the token was issued
  if (currentUser.password_changed_at) {
    const changedTimestamp = parseInt(currentUser.password_changed_at.getTime() / 1000, 10);

    // If token was issued before the password was changed, reject it
    if (decoded.iat < changedTimestamp) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'User recently changed password! Please log in again.'
      );
    }
  }

  // Grant access to protected route by attaching user to request
  req.user = currentUser;
  next();
});

module.exports = {
  protect
};
