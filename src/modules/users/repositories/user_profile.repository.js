const UserProfile = require('../models/user_profile.model');

class UserProfileRepository {
  async createProfile(profileData) {
    return await UserProfile.create(profileData);
  }

  async findByUserId(userId) {
    return await UserProfile.findOne({ user_id: userId });
  }

  async updateByUserId(userId, updateData) {
    return await UserProfile.findOneAndUpdate({ user_id: userId }, updateData, {
      new: true,
      runValidators: true
    });
  }
}

module.exports = new UserProfileRepository();

