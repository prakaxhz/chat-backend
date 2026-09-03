const Workspace = require('../models/workspace.model');
const WorkspaceMember = require('../models/workspace_member.model');

class WorkspaceRepository {
  async createWorkspace(workspaceData) {
    return await Workspace.create(workspaceData);
  }

  async addMember(workspaceId, userId, roleName, addedBy = null) {
    const WorkspaceRole = require('../models/workspace_role.model');
    
    // Find or create the role
    let role = await WorkspaceRole.findOne({ role: roleName });
    if (!role) {
      role = await WorkspaceRole.create({ role: roleName });
    }

    return await WorkspaceMember.create({
      workspace_id: workspaceId,
      user_id: userId,
      role_id: role._id,
      added_by: addedBy
    });
  }

  async findById(workspaceId) {
    return await Workspace.findById(workspaceId);
  }

  async findByCode(code) {
    return await Workspace.findOne({ code });
  }

  async getWorkspaceMembers(workspaceId) {
    return await WorkspaceMember.find({ workspace_id: workspaceId });
  }

  async getUserWorkspaces(userId) {
    // Find all memberships for this user and populate the workspace details and role details
    const memberships = await WorkspaceMember.find({ user_id: userId })
      .populate('workspace_id')
      .populate('role_id')
      .sort({ joined_at: -1 }); // Sort by newest joined first
      
    // Map over the memberships to extract just the workspace objects
    return memberships.map(member => {
      const workspace = member.workspace_id.toObject();
      workspace.my_role = member.role_id ? member.role_id.role : 'member';
      workspace.joined_at = member.joined_at;
      return workspace;
    });
  }

  async updateById(workspaceId, updateData) {
    return await Workspace.findByIdAndUpdate(workspaceId, updateData, {
      new: true,
      runValidators: true
    });
  }
}

module.exports = new WorkspaceRepository();

