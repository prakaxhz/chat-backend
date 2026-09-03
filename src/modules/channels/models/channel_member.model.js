const mongoose = require('mongoose');

const channelMemberSchema = new mongoose.Schema({
  channel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true,
    index: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkspaceMember',
    required: true,
    index: true
  },
  added_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkspaceMember',
    default: null
  },
  is_active: {
    type: Boolean,
    default: true
  },
  joined_at: {
    type: Date,
    default: Date.now
  },
  last_read_at: {
    type: Date,
    default: Date.now
  },
  deleted_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// A user can only join a specific channel once (active)
channelMemberSchema.index(
  { channel_id: 1, user_id: 1 },
  { unique: true, partialFilterExpression: { deleted_at: null } }
);

channelMemberSchema.pre(/^find/, function() {
  this.where({ deleted_at: null });
});

module.exports = mongoose.model('ChannelMember', channelMemberSchema);
