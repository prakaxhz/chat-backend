const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channel.controller');
const { protect } = require('../../../middleware/auth.middleware');
const { requireWorkspace } = require('../../../middleware/workspace.middleware');
const validate = require('../../../middleware/validation.middleware');
const { 
  createChannelSchema, 
  updateChannelSchema, 
  channelIdParamSchema 
} = require('../validations/channel.validation');

// All channel routes require authentication and a valid workspace context
router.use(protect);
router.use(requireWorkspace);

router.post('/', validate(createChannelSchema), channelController.createChannel);
router.get('/', channelController.listChannels);
router.get('/:id', validate(channelIdParamSchema), channelController.getChannel);
router.put('/:id', validate(updateChannelSchema), channelController.updateChannel);

// Archive and Unarchive
router.patch('/:id/archive', validate(channelIdParamSchema), channelController.archiveChannel);
router.patch('/:id/unarchive', validate(channelIdParamSchema), channelController.unarchiveChannel);

module.exports = router;

