import cron from 'cron';
import { FieldValue, firestore } from 'database';
import config from "config";

import { QueueProducer } from 'queue';
import { findRandomSection } from '../routes/lyrics.js';

export class SchedulingRepository {
  constructor() {
    const { url, sendQueueName } = config.get("RabbitMQ");
    this.queueProducer = new QueueProducer(url, sendQueueName);
    this.scheduleRef = firestore.collection('schedules');
    this.scheduledJobs = new Map();
  }

  async init() {
    await this.queueProducer.connect();
    console.log('queue connected');

    const schedules = (await this.scheduleRef.get()).docs;
    schedules.map(({ id: expression }) => this.createJob(expression));
  }

  async set(expression, channelId) {
    // 1. Remove old reference
    await this.remove(channelId);

    // 2. Add new reference
    await this.scheduleRef.doc(expression).set({
      discordChannelIds: FieldValue.arrayUnion(channelId)
    });

    // 3. Update cache
    this.createJob(expression);
  }

  createJob(expression) {
    if (this.scheduledJobs.has(expression)) {
      // Job already exists, skip
      return;
    }

    const job = new cron.CronJob(expression, async () => {
      const doc = await this.scheduleRef.doc(expression).get();

      if (!doc.exists)
        return;

      const ids = doc.data().discordChannelIds
      this.queueProducer.createJob({ ids, lyrics: await findRandomSection() });
    });

    job.start();
    this.scheduledJobs.set(expression, job);
  }

  async remove(channelId) {
    try {
      const snapshot = await this.scheduleRef.where('discordChannelIds', 'array-contains', channelId).get();
      if (!snapshot.empty) {
        await snapshot.docs.at(0).ref.update({
          discordChannelIds: FieldValue.arrayRemove(channelId)
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
}