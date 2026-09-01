const userRepository = require('../repositories/user.repository');
const ApiError = require('../../../shared/utils/ApiError');
const { StatusCodes } = require('http-status-codes');

class UserService {
  async getUserProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    const userProfileRepository = require('../repositories/user_profile.repository');
    const profile = await userProfileRepository.findByUserId(userId);

    // Convert Mongoose document to plain object to attach profile safely
    const userData = user.toObject();
    userData.profile = profile;

    return userData;
  }

  async updateProfile(userId, updateData) {
    const userProfileRepository = require('../repositories/user_profile.repository');

    // 1. Separate allowed fields for User Model vs UserProfile Model
    const allowedUserUpdates = {};
    const allowedProfileUpdates = {};
    
    // User Model updates
    if (updateData.name) allowedUserUpdates.name = updateData.name;
    
    // Profile Model updates
    if (updateData.avatar !== undefined) allowedProfileUpdates.avatar = updateData.avatar;
    if (updateData.gender !== undefined) allowedProfileUpdates.gender = updateData.gender;
    if (updateData.display_name !== undefined) allowedProfileUpdates.display_name = updateData.display_name;

    if (Object.keys(allowedUserUpdates).length === 0 && Object.keys(allowedProfileUpdates).length === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'No valid fields provided for update');
    }

    let updatedUser = null;
    let updatedProfile = null;

    // 2. Update User Model if needed
    if (Object.keys(allowedUserUpdates).length > 0) {
      updatedUser = await userRepository.updateById(userId, allowedUserUpdates);
      if (!updatedUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
      }
    } else {
      updatedUser = await userRepository.findById(userId);
    }

    // 3. Update UserProfile Model if needed
    if (Object.keys(allowedProfileUpdates).length > 0) {
      updatedProfile = await userProfileRepository.updateByUserId(userId, allowedProfileUpdates);
    } else {
      updatedProfile = await userProfileRepository.findByUserId(userId);
    }

    // 4. Return combined result
    const userData = updatedUser.toObject();
    userData.profile = updatedProfile;

    return userData;
  }
}

module.exports = new UserService();

