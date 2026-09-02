const authService = require('../services/auth.service');
const ApiResponse = require('../../../shared/utils/ApiResponse');
const asyncHandler = require('../../../shared/utils/asyncHandler');
const { StatusCodes } = require('http-status-codes');

// Helper to set cookie
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: true, // Must be true for sameSite 'none'
    sameSite: 'none', // Required for cross-origin (localhost -> vercel)
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// Helper to handle response based on client type
const handleAuthResponse = (req, res, token, user, message) => {
  const clientType = req.get('X-Client-Type') || 'web'; // Default to web if not provided
  
  const responseData = {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      color_code: user.color_code || null
    }
  };

  if (clientType === 'mobile') {
    // Mobile: Send token in JSON, do not set cookie
    responseData.token = token;
  } else {
    // Web: Set HttpOnly cookie, do not send token in JSON
    setTokenCookie(res, token);
  }

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, responseData, message)
  );
};

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
  
  // Merge profile color code if needed for response helper
  const userData = { ...user.toObject(), color_code: profile ? profile.color_code : null };

  handleAuthResponse(req, res, token, userData, 'Email verified successfully! You are now logged in.');
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
  const responseData = await authService.loginUser(email, password); // returns { token, user }

  handleAuthResponse(req, res, responseData.token, responseData.user, 'User logged in successfully');
});

exports.logout = asyncHandler(async (req, res) => {
  const clientType = req.get('X-Client-Type') || 'web';
  
  if (clientType !== 'mobile') {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000), // expires in 10 seconds
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
  }

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, null, 'User logged out successfully')
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
