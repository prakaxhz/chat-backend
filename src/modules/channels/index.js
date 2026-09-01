const channelRoutes = require('./routes/channel.routes');
const channelMemberRoutes = require('./routes/channel_member.routes');
const channelController = require('./controllers/channel.controller');
const channelMemberController = require('./controllers/channel_member.controller');
const channelService = require('./services/channel.service');
const channelMemberService = require('./services/channel_member.service');
const channelRepository = require('./repositories/channel.repository');
const channelMemberRepository = require('./repositories/channel_member.repository');

module.exports = {
  channelRoutes,
  channelMemberRoutes,
  channelController,
  channelMemberController,
  channelService,
  channelMemberService,
  channelRepository,
  channelMemberRepository
};

