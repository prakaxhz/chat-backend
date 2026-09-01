const WorkspaceRole = require('../../../modules/workspaces/models/workspace_role.model');

const seedWorkspaceRoles = async () => {
  const roles = [
    { role: 'owner' },
    { role: 'admin' },
    { role: 'member' },
    { role: 'guest' }
  ];

  try {
    // Check if roles already exist to avoid running the loop again
    const count = await WorkspaceRole.countDocuments();
    if (count > 0) {
      return; // Already seeded, do nothing
    }

    for (const roleData of roles) {
      const exists = await WorkspaceRole.findOne({ role: roleData.role });
      if (!exists) {
        await WorkspaceRole.create(roleData);
      }
    }
    console.log('✅ Workspace roles check complete');
  } catch (error) {
    console.error('❌ Error seeding workspace roles:', error);
  }
};

module.exports = seedWorkspaceRoles;
