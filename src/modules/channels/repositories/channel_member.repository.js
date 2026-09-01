const ChannelMember = require('../models/channel_member.model');

class ChannelMemberRepository {
  async addMember(channelId, workspaceMemberId, addedBy = null) {
    return await ChannelMember.create({
      channel_id: channelId,
      user_id: workspaceMemberId,
      added_by: addedBy
    });
  }

  async removeMember(channelId, workspaceMemberId) {
    return await ChannelMember.findOneAndUpdate(
      { channel_id: channelId, user_id: workspaceMemberId, deleted_at: null },
      { deleted_at: Date.now() },
      { new: true }
    );
  }

  async findActiveMember(channelId, workspaceMemberId) {
    return await ChannelMember.findOne({
      channel_id: channelId,
      user_id: workspaceMemberId,
      deleted_at: null
    });
  }
}

module.exports = new ChannelMemberRepository();

