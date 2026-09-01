const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../../../middleware/auth.middleware');
const validate = require('../../../middleware/validation.middleware');
const { updateProfileSchema } = require('../validations/user.validation');

// Apply protect middleware to all routes below this point
router.use(protect);

router.get('/me', userController.getMe);
router.put('/me', validate(updateProfileSchema), userController.updateMe);

module.exports = router;

