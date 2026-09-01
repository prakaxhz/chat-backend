const emailQueue = require('./email.queue');
const emailWorker = require('./email.worker');

module.exports = {
  emailQueue,
  emailWorker
};

