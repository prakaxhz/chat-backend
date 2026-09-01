require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../../../config/env');
const WorkspaceRole = require('../../../modules/workspaces/models/workspace_role.model');

const rolesToSeed = [
  { role: 'owner' },
  { role: 'admin' },
  { role: 'member' },
  { role: 'guest' }
];

const seedRoles = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(config.database.uri);
    console.log('✅ Connected to MongoDB Database');

    // 2. Clear existing roles (like Laravel's truncate)
    await WorkspaceRole.deleteMany();
    console.log('🗑️  Cleared existing workspace roles');

    // 3. Insert new roles
    await WorkspaceRole.insertMany(rolesToSeed);
    console.log('🌱 Workspace roles seeded successfully!');

    // 4. Exit the process successfully
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding roles:', error);
    process.exit(1); // Exit with failure code
  }
};

// Run the function
seedRoles();
