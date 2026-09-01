const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One-to-One relationship
    index: true
  },
  color_code: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say', null],
    default: null
  },
  display_name: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserProfile', userProfileSchema);

