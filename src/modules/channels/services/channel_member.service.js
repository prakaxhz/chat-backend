const channelMemberRepository = require('../repositories/channel_member.repository');
const channelRepository = require('../repositories/channel.repository');
const ApiError = require('../../../shared/utils/ApiError');
const { StatusCodes } = require('http-status-codes');

class ChannelMemberService {
  async addMemberToChannel(channelId, inviterWorkspaceMemberId, inviteeWorkspaceMemberId) {
    const channel = await channelRepository.findById(channelId);
    if (!channel) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Channel not found');
    }

    const existingMember = await channelMemberRepository.findActiveMember(channelId, inviteeWorkspaceMemberId);
    if (existingMember) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Member is already in the channel');
    }

    return await channelMemberRepository.addMember(channelId, inviteeWorkspaceMemberId, inviterWorkspaceMemberId);
  }

  async removeMemberFromChannel(channelId, removerWorkspaceMemberId, targetWorkspaceMemberId) {
    const channel = await channelRepository.findById(channelId);
    if (!channel) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Channel not found');
    }

    const removedMember = await channelMemberRepository.removeMember(channelId, targetWorkspaceMemberId);
    if (!removedMember) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Target user is not a member of this channel');
    }

    return removedMember;
  }

  async leaveChannel(channelId, workspaceMemberId) {
    const channel = await channelRepository.findById(channelId);
    if (!channel) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Channel not found');
    }

    const removedMember = await channelMemberRepository.removeMember(channelId, workspaceMemberId);
    if (!removedMember) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'You are not a member of this channel');
    }
    
    return removedMember;
  }
}

module.exports = new ChannelMemberService();

