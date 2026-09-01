const channelMemberService = require('../services/channel_member.service');
const channelService = require('../services/channel.service');
const ApiResponse = require('../../../shared/utils/ApiResponse');
const asyncHandler = require('../../../shared/utils/asyncHandler');
const { StatusCodes } = require('http-status-codes');

exports.leaveChannel = asyncHandler(async (req, res) => {
  // Use context directly from workspaceMiddleware!
  await channelMemberService.leaveChannel(req.params.id, req.workspaceMember._id);
  
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, null, 'You have left the channel successfully')
  );
});

exports.addMember = asyncHandler(async (req, res) => {
  // Use context directly from workspaceMiddleware!
  await channelMemberService.addMemberToChannel(req.params.id, req.workspaceMember._id, req.body.workspace_member_id);
  
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, null, 'Member added to channel successfully')
  );
});

exports.removeMember = asyncHandler(async (req, res) => {
  // Use context directly from workspaceMiddleware!
  await channelMemberService.removeMemberFromChannel(req.params.id, req.workspaceMember._id, req.params.workspaceMemberId);
  
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, null, 'Member removed from channel successfully')
  );
});

