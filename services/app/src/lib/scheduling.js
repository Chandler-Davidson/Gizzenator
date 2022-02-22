import cron from 'cron';
import config from 'config';
import { QueueProducer } from 'queue';

import { findRandomSection } from "../routes/lyrics/fetchSection.js";

export const jobCache = {};
const queueProducer = new QueueProducer(config.get("RabbitMQ"), 'lyrics.scheduled_send');

// Needs to be in classish thing
queueProducer.connect();

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
  const job = new cron.CronJob(expression, async () => {
    const { ids } = jobCache[expression];
    queueProducer.createJob({ ids, lyrics: await findRandomSection() })
  });

  job.start();
  return job;
}
