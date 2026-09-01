const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspace.controller');
const { protect } = require('../../../middleware/auth.middleware');
const { requireWorkspace } = require('../../../middleware/workspace.middleware');
const validate = require('../../../middleware/validation.middleware');
const { createWorkspaceSchema, updateWorkspaceSchema } = require('../validations/workspace.validation');

// All workspace routes require authentication
router.use(protect);

router.post('/', validate(createWorkspaceSchema), workspaceController.createWorkspace);
router.get('/', workspaceController.listUserWorkspaces);

// Details and Update require the x-workspace-code header
router.get('/details', requireWorkspace, workspaceController.getWorkspace);
router.put('/details', requireWorkspace, validate(updateWorkspaceSchema), workspaceController.updateWorkspace);

module.exports = router;
