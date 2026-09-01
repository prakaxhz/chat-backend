const workspaceService = require('../services/workspace.service');
const ApiResponse = require('../../../shared/utils/ApiResponse');
const asyncHandler = require('../../../shared/utils/asyncHandler');
const { StatusCodes } = require('http-status-codes');

/**
 * @desc    Create a new workspace
 * @route   POST /api/v1/workspaces
 * @access  Private
 */
exports.createWorkspace = asyncHandler(async (req, res) => {
  const workspace = await workspaceService.createWorkspace(req.user.id, req.body);
  
  res.status(StatusCodes.CREATED).json(
    new ApiResponse(StatusCodes.CREATED, { workspace }, 'Workspace created successfully')
  );
});

/**
 * @desc    Get all workspaces for current user
 * @route   GET /api/v1/workspaces
 * @access  Private
 */
exports.listUserWorkspaces = asyncHandler(async (req, res) => {
  const workspaces = await workspaceService.getUserWorkspaces(req.user.id);
  
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { workspaces }, 'Workspaces retrieved successfully')
  );
});

/**
 * @desc    Get workspace details (Context from Header)
 * @route   GET /api/v1/workspaces/details
 * @access  Private
 */
exports.getWorkspace = asyncHandler(async (req, res) => {
  // We already have req.workspace from the middleware!
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { workspace: req.workspace }, 'Workspace retrieved successfully')
  );
});

/**
 * @desc    Update workspace details
 * @route   PUT /api/v1/workspaces/details
 * @access  Private
 */
exports.updateWorkspace = asyncHandler(async (req, res) => {
  const workspace = await workspaceService.updateWorkspace(
    req.workspace._id, // Use ID from header context
    req.user.id, 
    req.body
  );
  
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { workspace }, 'Workspace updated successfully')
  );
});

