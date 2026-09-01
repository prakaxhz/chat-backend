const { StatusCodes } = require('http-status-codes');
const ApiError = require('../shared/utils/ApiError');
const asyncHandler = require('../shared/utils/asyncHandler');
const Workspace = require('../modules/workspaces/models/workspace.model');
const WorkspaceMember = require('../modules/workspaces/models/workspace_member.model');

const mongoose = require('mongoose');

exports.requireWorkspace = asyncHandler(async (req, res, next) => {
  const workspaceIdentifier = req.headers['X-Workspace-ID'];

  if (!workspaceIdentifier) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'X-Workspace-ID header is required');
  }

  // Find workspace by either ObjectId or Code
  const query = { deleted_at: null };
  if (mongoose.Types.ObjectId.isValid(workspaceIdentifier)) {
    query._id = workspaceIdentifier;
  } else {
    query.code = workspaceIdentifier;
  }

  const workspace = await Workspace.findOne(query);
  if (!workspace) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Workspace not found');
  }

  // Ensure current user is an active member of this workspace
  const membership = await WorkspaceMember.findOne({ 
    workspace_id: workspace._id, 
    user_id: req.user.id, 
    deleted_at: null 
  }).populate('role_id');

  if (!membership) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You are not an active member of this workspace');
  }

  // Attach workspace and membership context to the request
  req.workspace = workspace;
  req.workspaceMember = membership;
  
  next();
});

