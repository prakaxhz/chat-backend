const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  code: {
    type: String,
    required: [true, 'Workspace code is required'],
    unique: true,
    uppercase: true,
    match: [/^[A-Z0-9]{10}$/, 'Code must be exactly 10 alphanumeric characters'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Workspace name is required'],
    trim: true,
    minlength: [2, 'Workspace name must be at least 2 characters'],
    maxlength: [50, 'Workspace name cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [255, 'Description cannot exceed 255 characters'],
    default: ''
  },
  logo: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
    index: true
  },
  deleted_at: {
    type: Date,
    default: null,
    index: true
  }
}, {
  timestamps: true
});

// Add a query middleware for soft deletes so that `deleted_at: null` is the default for find operations
workspaceSchema.pre(/^find/, function(next) {
  // `this` refers to the current query
  // Only return documents where deleted_at is null
  this.find({ deleted_at: null });
  next();
});

module.exports = mongoose.model('Workspace', workspaceSchema);

