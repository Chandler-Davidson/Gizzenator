import cron from 'cron';
import config from 'config';
import { QueuePublisher } from './queuePublisher.js';

export const jobCache = {};
const queuePublisher = new QueuePublisher(config.get("RabbitMQ"));
// Needs to be in classish thing
queuePublisher.connect();

export function addJob(expression, guildId) {
  const { ids } = jobCache[expression] ?? {};

  if (!ids) {
    jobCache[expression] = {
      ids: [guildId],
      job: scheduleJob(expression)
    };
  } else {
    jobCache[expression].ids.push(guildId);
  }
}

export function removeJob(expression, guildId) {
  const { ids, job } = jobCache[expression];

  jobCache[expression].ids = ids.filter(id => id !== guildId);

  if (ids.length == 1) {
    job.stop();
    delete jobCache[expression];
  }
}

function scheduleJob(expression) {
  const job = new cron.CronJob('* * * * * *', () => {
    const { ids } = jobCache[expression];
    queuePublisher.createJob(ids)
  });

  job.start();
  return job;
}
