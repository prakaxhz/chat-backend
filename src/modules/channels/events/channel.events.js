const { getIo } = require('../../../app/socket');
const workspaceRepository = require('../../workspaces/repositories/workspace.repository');

class ChannelEvents {
  /**
   * Broadcasts an event to all members of a workspace
   */
  async broadcastToWorkspace(workspaceId, eventName, payload) {
    const workspaceMembers = await workspaceRepository.getWorkspaceMembers(workspaceId);
    const userRooms = workspaceMembers.map(member => `user.${member.user_id}`);
    
    if (userRooms.length > 0) {
      getIo().to(userRooms).emit(eventName, payload);
    }
  }

  async emitChannelCreated(channel) {
    await this.broadcastToWorkspace(channel.workspace_id, 'channel.created', channel);
  }

  async emitChannelUpdated(channel) {
    await this.broadcastToWorkspace(channel.workspace_id, 'channel.updated', channel);
  }

  async emitChannelArchived(channel) {
    await this.broadcastToWorkspace(channel.workspace_id, 'channel.archived', channel);
  }

  async emitChannelUnarchived(channel) {
    await this.broadcastToWorkspace(channel.workspace_id, 'channel.unarchived', channel);
  }
}

module.exports = new ChannelEvents();
