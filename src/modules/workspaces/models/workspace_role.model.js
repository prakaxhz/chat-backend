const mongoose = require('mongoose');

const workspaceRoleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    trim: true,
    lowercase: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WorkspaceRole', workspaceRoleSchema);

