const workspaceRepository = require('../repositories/workspace.repository');
const ApiError = require('../../../shared/utils/ApiError');
const { StatusCodes } = require('http-status-codes');
const { generateWorkspaceCode } = require('../../../shared/utils/codeGenerator');

class WorkspaceService {
  async createWorkspace(ownerId, data) {
    // 1. Generate unique 10-character code and ensure it doesn't already exist
    let code;
    let isUnique = false;
    
    while (!isUnique) {
      code = generateWorkspaceCode();
      const existingWorkspace = await workspaceRepository.findByCode(code);
      if (!existingWorkspace) {
        isUnique = true;
      }
    }

    // 2. Create the workspace
    const workspace = await workspaceRepository.createWorkspace({
      owner_id: ownerId,
      code: code,
      name: data.name,
      description: data.description,
      logo: data.logo
    });

    // 3. Automatically add the owner as an 'owner' in the workspace_member table
    await workspaceRepository.addMember(workspace._id, ownerId, 'owner', ownerId);

    return workspace;
  }

  async getUserWorkspaces(userId) {
    return await workspaceRepository.getUserWorkspaces(userId);
  }

  async getWorkspaceDetails(workspaceId, userId) {
    const workspace = await workspaceRepository.findById(workspaceId);
    
    if (!workspace) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Workspace not found');
    }

    // TODO: Add authorization check here later (is userId a member of this workspace?)
    
    return workspace;
  }

  async updateWorkspace(workspaceId, ownerId, updateData) {
    const workspace = await workspaceRepository.findById(workspaceId);
    
    if (!workspace) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Workspace not found');
    }

    // 1. Authorization: Only the owner can update the workspace details
    if (workspace.owner_id.toString() !== ownerId.toString()) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to update this workspace');
    }

    // 2. Filter allowed fields for update
    const allowedUpdates = {};
    if (updateData.name !== undefined) allowedUpdates.name = updateData.name;
    if (updateData.description !== undefined) allowedUpdates.description = updateData.description;
    if (updateData.logo !== undefined) allowedUpdates.logo = updateData.logo;
    if (updateData.status !== undefined) allowedUpdates.status = updateData.status;

    if (Object.keys(allowedUpdates).length === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'No valid fields provided for update');
    }

    // 3. Perform update
    const updatedWorkspace = await workspaceRepository.updateById(workspaceId, allowedUpdates);
    
    return updatedWorkspace;
  }
}

module.exports = new WorkspaceService();

