const channelService = require('../services/channel.service');
const ApiResponse = require('../../../shared/utils/ApiResponse');
const asyncHandler = require('../../../shared/utils/asyncHandler');
const { StatusCodes } = require('http-status-codes');

exports.createChannel = asyncHandler(async (req, res) => {
  // Use context directly from workspaceMiddleware! No DB lookups needed!
  const workspaceId = req.workspace._id;
  const createdByMemberId = req.workspaceMember._id;

  const channel = await channelService.createChannel(workspaceId, createdByMemberId, req.body);
  
  res.status(StatusCodes.CREATED).json(
    new ApiResponse(StatusCodes.CREATED, { channel }, 'Channel created successfully')
  );
});

exports.listChannels = asyncHandler(async (req, res) => {
  // Use workspace ID from header context
  const channels = await channelService.listWorkspaceChannels(req.workspace._id);
  
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { channels }, 'Channels retrieved successfully')
  );
});

exports.getChannel = asyncHandler(async (req, res) => {
  const channel = await channelService.getChannelDetails(req.params.id);
  
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { channel }, 'Channel retrieved successfully')
  );
});

exports.updateChannel = asyncHandler(async (req, res) => {
  const channel = await channelService.updateChannel(req.params.id, req.body);
  
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { channel }, 'Channel updated successfully')
  );
});

exports.archiveChannel = asyncHandler(async (req, res) => {
  const channel = await channelService.toggleArchive(req.params.id, true);
  
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { channel }, 'Channel archived successfully')
  );
});

exports.unarchiveChannel = asyncHandler(async (req, res) => {
  const channel = await channelService.toggleArchive(req.params.id, false);
  
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { channel }, 'Channel unarchived successfully')
  );
});

// Member controllers have been moved to channel_member.controller.js

