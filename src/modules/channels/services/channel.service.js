const channelRepository = require('../repositories/channel.repository');
const ApiError = require('../../../shared/utils/ApiError');
const { StatusCodes } = require('http-status-codes');
const { generateChannelCode } = require('../../../shared/utils/codeGenerator');
const channelEvents = require('../events/channel.events');
const channelMemberRepository = require('../repositories/channel_member.repository');

class ChannelService {
  async createChannel(workspaceId, createdByMemberId, data) {
    let code;
    let isUnique = false;
    
    while (!isUnique) {
      code = generateChannelCode();
      const existingChannel = await channelRepository.findByCode(code);
      if (!existingChannel) {
        isUnique = true;
      }
    }

    const channel = await channelRepository.createChannel({
      workspace_id: workspaceId,
      code: code,
      name: data.name,
      description: data.description,
      is_dm: data.is_dm || false,
      is_private: data.is_private || false,
      created_by: createdByMemberId
    });

    await channelMemberRepository.addMember(channel._id, createdByMemberId, createdByMemberId);

    // Broadcast to all workspace members in a single batch via events module
    await channelEvents.emitChannelCreated(channel);

    return channel;
  }

  async listWorkspaceChannels(workspaceId) {
    return await channelRepository.findWorkspaceChannels(workspaceId);
  }

  async getChannelDetails(channelId) {
    const channel = await channelRepository.findById(channelId);
    if (!channel) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Channel not found');
    }
    return channel;
  }

  async updateChannel(channelId, updateData) {
    const channel = await channelRepository.findById(channelId);
    if (!channel) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Channel not found');
    }

    const allowedUpdates = {};
    if (updateData.name !== undefined) allowedUpdates.name = updateData.name;
    if (updateData.description !== undefined) allowedUpdates.description = updateData.description;
    if (updateData.is_private !== undefined) allowedUpdates.is_private = updateData.is_private;

    if (Object.keys(allowedUpdates).length === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'No valid fields provided for update');
    }

    const updatedChannel = await channelRepository.updateById(channelId, allowedUpdates);

    // Broadcast to all workspace members in a single batch via events module
    await channelEvents.emitChannelUpdated(updatedChannel);

    return updatedChannel;
  }

  async toggleArchive(channelId, isArchived) {
    const channel = await channelRepository.findById(channelId);
    if (!channel) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Channel not found');
    }

    const updatedChannel = await channelRepository.updateById(channelId, { is_active: !isArchived });

    // Broadcast to all workspace members in a single batch via events module
    if (isArchived) {
      await channelEvents.emitChannelArchived(updatedChannel);
    } else {
      await channelEvents.emitChannelUnarchived(updatedChannel);
    }

    return updatedChannel;
  }
}

module.exports = new ChannelService();

