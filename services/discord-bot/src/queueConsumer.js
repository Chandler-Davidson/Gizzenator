import amqp from "amqplib";

const queueName = "lyrics.scheduled_send";

export class QueueConsumer {
  constructor(config) {
    this.url = config.url;
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
      await this.channel.assertQueue(queueName, { durable: true });
      await this.channel.consume(queueName, async (msg) => {
        console.log('Processing message');
        const success = await callback(msg);

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
