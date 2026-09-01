const { Worker } = require('bullmq');
const connection = require('./redis.connection');
const { sendEmail } = require('../../shared/utils/email');

const emailWorker = new Worker(
  'email-queue',
  async (job) => {
    const { to, subject, text, html } = job.data;

    await sendEmail(to, subject, text, html);

    console.log(`✅ Email job ${job.id} completed successfully`);
  },
  {
    connection,
    concurrency: 5
  }
);

emailWorker.on('failed', (job, err) => {
  console.error(`❌ Email job ${job.id} failed with error: ${err.message}`);
});

module.exports = emailWorker;

