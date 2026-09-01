const express = require('express');
const router = express.Router();
const channelMemberController = require('../controllers/channel_member.controller');
const { protect } = require('../../../middleware/auth.middleware');
const { requireWorkspace } = require('../../../middleware/workspace.middleware');
const validate = require('../../../middleware/validation.middleware');
const { 
  addMemberSchema, 
  removeMemberSchema, 
  leaveChannelSchema 
} = require('../validations/channel_member.validation');

// All channel member routes require authentication and workspace context
router.use(protect);
router.use(requireWorkspace);

// These routes expect to be mounted at /api/v1/channels
// Example: /api/v1/channels/:id/leave

// Leave channel
router.delete('/:id/leave', validate(leaveChannelSchema), channelMemberController.leaveChannel);

// Add/Remove members
router.post('/:id/members', validate(addMemberSchema), channelMemberController.addMember);
router.delete('/:id/members/:workspaceMemberId', validate(removeMemberSchema), channelMemberController.removeMember);

module.exports = router;

