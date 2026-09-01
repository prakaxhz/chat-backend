const userRoutes = require('./routes/user.routes');
const userController = require('./controllers/user.controller');
const userService = require('./services/user.service');
const userRepository = require('./repositories/user.repository');
const userModel = require('./models/user.model');

module.exports = {
  userRoutes,
  userController,
  userService,
  userRepository,
  userModel
};

