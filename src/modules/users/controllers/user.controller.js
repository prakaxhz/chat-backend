const userService = require('../services/user.service');
const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../../../shared/utils/ApiResponse');
const asyncHandler = require('../../../shared/utils/asyncHandler');

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/v1/users/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res) => {
  // We can just fetch fresh data using the service to ensure it's up to date
  const user = await userService.getUserProfile(req.user.id);

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { user }, 'Profile retrieved successfully')
  );
});

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/users/me
 * @access  Private
 */
exports.updateMe = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateProfile(req.user.id, req.body);

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { user: updatedUser }, 'Profile updated successfully')
  );
});
