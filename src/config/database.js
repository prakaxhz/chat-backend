const mongoose = require('mongoose');
const config = require('./env');

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(config.database.uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Automatically run seeders after connection
    const seedWorkspaceRoles = require('../infrastructure/database/seeders/role.seeder');
    await seedWorkspaceRoles();
    
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDatabase;

