import cron from 'cron';
import { prisma } from 'database';
import config from "config";

import { QueueProducer } from 'queue';
import { findRandomSection } from '../routes/lyrics.js';

export class SchedulingRepository {
  constructor() {
    this.queueProducer = new QueueProducer(config.get("RabbitMQ"), 'lyrics.scheduled_send');
  }

  async init() {
    this.queueProducer.connect();
    const schedules = await prisma.schedule.findMany({ distinct: ['expression'] });
    const entries = schedules.map(({expression}) => [expression, this.createJob(expression)]);
    this.jobCache = new Map(entries);
    console.log('queue connected');
  }

  async set(expression, channelId) {
    await upsertChannel(expression, channelId);

    if (!this.jobCache.has(expression)) {
      this.jobCache.set(expression, this.createJob(expression));
    }
  }

  createJob(expression) {
    const job = new cron.CronJob(expression, async () => {
      const channels = await findChannels(expression);
      const ids = channels.map(c => c.discordChannelId);
      this.queueProducer.createJob({ ids, lyrics: await findRandomSection() });
    });
  
    job.start();
    return job;
  }

  remove(channelId) {
    return prisma.channel.delete({
      where: { discordChannelId: channelId }
    });
  }
}



function upsertChannel(expression, channelId) {
  return prisma.channel.upsert({
    where: { discordChannelId: channelId },
    update: {
      schedule: {
        connectOrCreate: {
          where: { expression },
          create: { expression }
        }
      }
    },
    create: {
      discordChannelId: channelId,
      schedule: {
        connectOrCreate: {
          where: { expression },
          create: { expression }
        }
      }
    }
  });
}

function findChannels(expression) {
  return prisma.channel.findMany({
    where: {
      schedule: {
        expression
      }
    }
  });
}

