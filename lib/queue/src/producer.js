import amqp from "amqplib";

export class QueueProducer {
  constructor(url, queueName) {
    this.url = url;
    this.queueName = queueName
  }

  async connect() {
    this.connection = await amqp.connect(this.url, "heartbeat=60");
    this.channel = await this.connection.createChannel();
    try {
      await this.channel.assertQueue(this.queueName, { durable: true });
    } catch (err) {
      console.error("Error connecting to queue", err);
    }
  }

  async closeConnection() {
    await this.channel.close();
    await this.connection.close();
  }

  createJob(job) {
    return this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(job)));
  }
}
