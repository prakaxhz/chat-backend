const User = require('../models/user.model');

class UserRepository {
  async createUser(userData) {
    return await User.create(userData);
  }
  
  async findById(id, selectFields = '') {
    return await User.findById(id).select(selectFields);
  }

  async findByEmail(email, selectFields = '') {
    return await User.findOne({ email }).select(selectFields);
  }

  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  }

  async findUsers(filter = {}, selectFields = '') {
    return await User.find(filter).select(selectFields);
  }
}

module.exports = new UserRepository();

