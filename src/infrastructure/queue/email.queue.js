const { Queue } = require('bullmq');
const connection = require('./redis.connection');

const emailQueue = new Queue('email-queue', { connection });

module.exports = emailQueue;

