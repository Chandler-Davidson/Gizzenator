import amqp from "amqplib";

const queueName = "lyrics.scheduled_send";

export class QueuePublisher {
  constructor({ url }) {
    this.url = url;
  }

  async connect() {
    this.connection = await amqp.connect(this.url, "heartbeat=60");
    this.channel = await this.connection.createChannel();
    try {
      await this.channel.assertQueue(queueName, { durable: true });
    } catch (err) {
      console.error("Error connecting to queue", err);
    }
  }

  async closeConnection() {
    await this.channel.close();
    await this.connection.close();
  }

  createJob(guildIds) {
    return this.channel.sendToQueue(queueName,
      encode({ guildIds }));
  }
}

const encode = obj => Buffer.from(JSON.stringify(obj));
