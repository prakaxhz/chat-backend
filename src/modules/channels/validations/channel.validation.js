const { z } = require('zod');

const createChannelSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
    description: z.string().max(255, 'Description cannot exceed 255 characters').optional(),
    is_dm: z.boolean().optional(),
    is_private: z.boolean().optional()
  }).strict()
});

const updateChannelSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid channel ID')
  }),
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters').optional(),
    description: z.string().max(255, 'Description cannot exceed 255 characters').optional(),
    is_private: z.boolean().optional()
  }).strict()
});

const channelIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid channel ID')
  })
});

module.exports = {
  createChannelSchema,
  updateChannelSchema,
  channelIdParamSchema
};

