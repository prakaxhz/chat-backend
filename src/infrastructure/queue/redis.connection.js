const IORedis = require('ioredis');
const config = require('../../config/env');

const connection = new IORedis(config.redis.url, {
  maxRetriesPerRequest: null,
});

module.exports = connection;

