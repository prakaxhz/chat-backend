const authService = require('../services/auth.service');
const ApiResponse = require('../../../shared/utils/ApiResponse');
const asyncHandler = require('../../../shared/utils/asyncHandler');
const { StatusCodes } = require('http-status-codes');

exports.register = asyncHandler(async (req, res) => {
  const { user, profile } = await authService.register(req.body);

  res.status(StatusCodes.CREATED).json(
    new ApiResponse(StatusCodes.CREATED, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        color_code: profile ? profile.color_code : null
      }
    }, 'User registered successfully. Please check your email for the OTP.')
  );
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  
  const { user, profile } = await authService.verifyEmail(email, otp);
  const token = authService.generateToken(user._id);
  
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        color_code: profile ? profile.color_code : null
      }
    }, 'Email verified successfully! You are now logged in.')
  );
});

exports.resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  await authService.resendOtp(email);
  
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, null, 'A new OTP has been sent to your email.')
  );
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const responseData = await authService.loginUser(email, password);

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, responseData, 'User logged in successfully')
  );
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, null, 'If that email exists, a reset OTP has been sent.')
  );
});

exports.verifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  await authService.verifyResetOtp(email, otp);
  
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, null, 'OTP is valid. You can now reset your password.')
  );
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  await authService.resetPassword(email, password);
  
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, null, 'Password updated successfully. You can now login.')
  );
});
