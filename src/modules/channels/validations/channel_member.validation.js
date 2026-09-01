const { z } = require('zod');

const addMemberSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid channel ID')
  }),
  body: z.object({
    workspace_member_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid workspace member ID')
  }).strict()
});

const removeMemberSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid channel ID'),
    workspaceMemberId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid workspace member ID')
  })
});

const leaveChannelSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid channel ID')
  })
});

module.exports = {
  addMemberSchema,
  removeMemberSchema,
  leaveChannelSchema
};

