const express = require('express');
const router = express.Router();

// Import route modules
const { authRoutes } = require('../modules/auth');
const { userRoutes } = require('../modules/users');
const { workspaceRoutes } = require('../modules/workspaces');
const { channelRoutes, channelMemberRoutes } = require('../modules/channels');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/channels', channelRoutes);
router.use('/channels', channelMemberRoutes);

// Future modules can be mounted here
// router.use('/workspaces', require('../modules/workspaces/workspace.routes'));
// router.use('/channels', require('../modules/channels/channel.routes'));

module.exports = router;

