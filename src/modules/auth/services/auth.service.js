const jwt = require('jsonwebtoken');
const config = require('../../../config/env');
const userRepository = require('../../users/repositories/user.repository');
const userProfileRepository = require('../../users/repositories/user_profile.repository');
const otpService = require('./otp.service');
const ApiError = require('../../../shared/utils/ApiError');
const { generateRandomHexColor } = require('../../../shared/utils/colorUtils');
const { emailQueue } = require('../../../infrastructure/queue');
const { getVerificationEmailTemplate } = require('../../../shared/templates/email.templates');
const { StatusCodes } = require('http-status-codes');

class AuthService {
  generateToken(id) {
    return jwt.sign({ id }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  }

  async register(userData) {
    let user = await userRepository.findByEmail(userData.email);
    let profile = null;

    if (user) {
      if (user.email_verified_at) {
        throw new ApiError(StatusCodes.CONFLICT, 'User with this email already exists');
      } else {
        user.name = userData.name;
        user.password = userData.password;
        await user.save();

        profile = await userProfileRepository.findByUserId(user._id);
        if (!profile) {
          profile = await userProfileRepository.createProfile({
            user_id: user._id,
            color_code: generateRandomHexColor(),
          });
        }
      }
    } else {
      user = await userRepository.createUser({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });

      profile = await userProfileRepository.createProfile({
        user_id: user._id,
        color_code: generateRandomHexColor(),
      });
    }

    const otpCode = await otpService.generate(user._id);

    // const emailContent = getVerificationEmailTemplate(otpCode);
    // emailQueue.add('sendOtpEmail', {
    //   to: user.email,
    //   subject: 'Verify Your Account - OTP',
    //   text: emailContent.text,
    //   html: emailContent.html
    // });

    return { user, profile };
  }

  async verifyEmail(email, enteredOtp) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    if (user.email_verified_at) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email is already verified');
    }

    await otpService.validate(user._id, enteredOtp);

    user.email_verified_at = new Date();
    await user.save();

    const profile = await userProfileRepository.findByUserId(user._id);

    return { user, profile };
  }

  async resendOtp(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    if (user.email_verified_at) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email is already verified');
    }

    const otpCode = await otpService.generate(user._id);

    // const emailContent = getVerificationEmailTemplate(otpCode);
    // emailQueue.add('sendOtpEmail', {
    //   to: user.email,
    //   subject: 'Verify Your Account - OTP',
    //   text: emailContent.text,
    //   html: emailContent.html
    // });

    return true;
  }

  async loginUser(email, password) {
    const user = await userRepository.findByEmail(email, '+password');

    if (!user || !(await user.matchPassword(password))) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect email or password');
    }

    const token = this.generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    };
  }

  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return true;
    }

    const otpCode = await otpService.generate(user._id, 'PASSWORD_RESET');

    // const { getPasswordResetEmailTemplate } = require('../../../shared/templates/email.templates');
    // const emailContent = getPasswordResetEmailTemplate(otpCode);

    // emailQueue.add('sendOtpEmail', {
    //   to: user.email,
    //   subject: 'Password Reset Request',
    //   text: emailContent.text,
    //   html: emailContent.html
    // });

    return true;
  }

  async verifyResetOtp(email, enteredOtp) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    await otpService.validate(user._id, enteredOtp, 'PASSWORD_RESET');

    return true;
  }

  async resetPassword(email, new_password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    user.password = new_password;
    user.password_changed_at = new Date();
    await user.save();

    return true;
  }
}

module.exports = new AuthService();
