const { z } = require('zod');

const createWorkspaceSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Workspace name is required',
    }).min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
    description: z.string().max(255, 'Description cannot exceed 255 characters').optional(),
    logo: z.string().url('Must be a valid URL').optional().or(z.literal(''))
  }).strict()
});

const updateWorkspaceSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters').optional(),
    description: z.string().max(255, 'Description cannot exceed 255 characters').optional(),
    logo: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    status: z.enum(['active', 'inactive']).optional()
  }).strict()
});

module.exports = {
  createWorkspaceSchema,
  updateWorkspaceSchema
};

