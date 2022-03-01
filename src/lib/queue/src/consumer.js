import amqp from "amqplib";

export class QueueConsumer {
  constructor({ url }, queueName) {
    this.url = url;
    this.queueName = queueName;
  }

  async connect() {
    console.log("Connecting");
    this.connection = await amqp.connect(this.url, "heartbeat=60");
    this.channel = await this.connection.createChannel();
    this.channel.prefetch(1);
    console.log(" [*] Waiting for messages.");
  }

  async closeConnection() {
    await this.channel.close();
    await this.connection.close();
  }

  async consume(callback) {
    try {
      await this.channel.assertQueue(this.queueName, { durable: true });
      await this.channel.consume(this.queueName, async (msg) => {
        const message = JSON.parse(msg.content);
        const success = await callback(message);

        if (success)
          this.channel.ack(msg);
      },
        {
          noAck: false,
          consumerTag: 'lyrics_section'
        });
    }
    catch (ex) {
      console.error('Failed to connect: ' + ex);
    }
  }
}
