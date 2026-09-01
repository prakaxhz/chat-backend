const workspaceRoutes = require('./routes/workspace.routes');
const workspaceController = require('./controllers/workspace.controller');
const workspaceService = require('./services/workspace.service');
const workspaceRepository = require('./repositories/workspace.repository');

module.exports = {
  workspaceRoutes,
  workspaceController,
  workspaceService,
  workspaceRepository
};

