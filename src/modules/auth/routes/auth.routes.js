const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../../../middleware/validation.middleware');
const { 
  registerSchema, 
  loginSchema, 
  verifyEmailSchema, 
  resendOtpSchema,
  forgotPasswordSchema,
  verifyResetOtpSchema,
  resetPasswordSchema
} = require('../validations/auth.validation');

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/verify-email', validate(verifyEmailSchema), authController.verifyEmail);
router.post('/resend-otp', validate(resendOtpSchema), authController.resendOtp);

// Password Reset Routes
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/verify-reset-otp', validate(verifyResetOtpSchema), authController.verifyResetOtp);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

module.exports = router;
