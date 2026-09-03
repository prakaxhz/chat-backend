const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  workspace_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true,
    index: true
  },
  code: {
    type: String,
    required: [true, 'Channel code is required'],
    unique: true,
    uppercase: true,
    match: [/^[A-Z0-9]{8}$/, 'Code must be exactly 8 alphanumeric characters']
  },
  name: {
    type: String,
    required: [true, 'Channel name is required'],
    trim: true,
    minlength: [2, 'Channel name must be at least 2 characters'],
    maxlength: [50, 'Channel name cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [255, 'Description cannot exceed 255 characters'],
    default: ''
  },
  is_dm: {
    type: Boolean,
    default: false
  },
  is_private: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true,
    index: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkspaceMember',
    required: true
  },
  deleted_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// A workspace cannot have two channels with the exact same name (unless one is soft deleted)
channelSchema.index(
  { workspace_id: 1, name: 1 },
  { unique: true, partialFilterExpression: { deleted_at: null } }
);

// Add a query middleware for soft deletes so that `deleted_at: null` is the default for find operations
channelSchema.pre(/^find/, function() {
  this.where({ deleted_at: null });
});

module.exports = mongoose.model('Channel', channelSchema);
