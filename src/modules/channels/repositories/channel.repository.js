const Channel = require('../models/channel.model');

class ChannelRepository {
  async createChannel(channelData) {
    return await Channel.create(channelData);
  }

  async findByCode(code) {
    return await Channel.findOne({ code });
  }

  async findById(channelId) {
    return await Channel.findById(channelId);
  }

  async updateById(channelId, updateData) {
    return await Channel.findByIdAndUpdate(channelId, updateData, {
      new: true,
      runValidators: true
    });
  }

  async findWorkspaceChannels(workspaceId) {
    return await Channel.find({ workspace_id: workspaceId }).sort({ createdAt: 1 });
  }

}

module.exports = new ChannelRepository();

