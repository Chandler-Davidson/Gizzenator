import { prisma } from "database";

import cron, { job } from 'cron';
import config from 'config';
import { QueueProducer } from 'queue';

import { findRandomSection } from "../routes/lyrics/fetchSection.js";
import { scheduleCache } from './memoryCache.js';

const queueProducer = new QueueProducer(config.get("RabbitMQ"), 'lyrics.scheduled_send');
// Needs to be in classish thing
queueProducer.connect();

export const jobCache = new Map(scheduleCacheLoader())


import { prisma } from "database";

export class ScheduleMemoryCache {
  init() {
    const schedules = await prisma.schedule.findMany({
      distinct: ['expression'],
      include: { channels: true }
    });

    const entries = schedules.map(s => [s.expression, s.channels.map(c => c.discordChannelId)]);
    this.cache = new Map(entries);
  }

  setSchedule(expression, channelId) {
    const channel = await prisma.channel.upsert({
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

    const prevEntry = [...this.cache.entries()].find(([exp, { ids }]) => )
  }
}