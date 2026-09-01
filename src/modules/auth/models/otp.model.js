const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  otp: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['EMAIL_VERIFICATION', 'PASSWORD_RESET'],
    default: 'EMAIL_VERIFICATION'
  },
  expires_at: {
    type: Date,
    required: true,
    index: { expires: '0' } 
  }
}, {
  timestamps: true
});

// Hash the OTP before saving to database for security
otpSchema.pre('save', async function() {
  if (!this.isModified('otp')) return;
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp, salt);
});

otpSchema.methods.matchOTP = async function(enteredOTP) {
  return await bcrypt.compare(enteredOTP, this.otp);
};

module.exports = mongoose.model('Otp', otpSchema);

