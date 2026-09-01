const { z } = require('zod');

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    avatar: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
    display_name: z.string().optional()
  }).strict() // Prevent sending completely unknown fields
});

module.exports = {
  updateProfileSchema
};
