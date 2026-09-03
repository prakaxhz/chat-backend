const mongoose = require('mongoose');

const workspaceMemberSchema = new mongoose.Schema({
  workspace_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true,
    index: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkspaceRole',
    required: true,
    index: true
  },
  added_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  is_active: {
    type: Boolean,
    default: true,
    index: true
  },
  joined_at: {
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

// A user can only be a member of a specific workspace once (where deleted_at is null)
// We use a partial index here to enforce uniqueness only for active memberships
workspaceMemberSchema.index(
  { workspace_id: 1, user_id: 1 },
  { unique: true, partialFilterExpression: { deleted_at: null } }
);

// Add a query middleware for soft deletes so that `deleted_at: null` is the default for find operations
workspaceMemberSchema.pre(/^find/, function() {
  this.where({ deleted_at: null });
});

module.exports = mongoose.model('WorkspaceMember', workspaceMemberSchema);

