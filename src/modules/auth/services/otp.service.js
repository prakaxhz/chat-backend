const Otp = require('../models/otp.model');
const ApiError = require('../../../shared/utils/ApiError');
const { StatusCodes } = require('http-status-codes');

class OtpService {

  async generate(userId, type = 'EMAIL_VERIFICATION') {
    await Otp.deleteMany({ user_id: userId, type });

    // const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpCode = 123456;

    await Otp.create({
      user_id: userId,
      otp: otpCode,
      type,
      expires_at: new Date(Date.now() + 10 * 60 * 1000)
    });

    return otpCode;
  }

  async validate(userId, enteredOtp, type = 'EMAIL_VERIFICATION') {
    const otpRecord = await Otp.findOne({ user_id: userId, type });
    
    if (!otpRecord) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'OTP expired or not found');
    }

    const isMatch = await otpRecord.matchOTP(enteredOtp);
    if (!isMatch) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid OTP');
    }

    await Otp.deleteOne({ _id: otpRecord._id });
  }
}

module.exports = new OtpService();
