import amqp from "amqplib";
import { messageRouter } from "./messageRouter.js";

const queueName = "lyrics.parse_sections";

export class QueueConsumer {
  constructor(config, logger) {
    this.url = config.url;
    this.logger = logger;
  }

  async connect() {
    this.logger.info("Connecting");
    this.connection = await amqp.connect(this.url, "heartbeat=60");
    this.channel = await this.connection.createChannel();
    this.channel.prefetch(1);
    this.logger.info(" [*] Waiting for messages.");
  }

  async closeConnection() {
    await this.channel.close();
    await this.connection.close();
  }

  async consume() {
    try {
      await this.channel.assertQueue(queueName, { durable: true });
      await this.channel.consume(queueName, async (msg) => {
        this.logger.info('Processing message');
        const success = await messageRouter(msg, this.logger);

        if (success)
          this.channel.ack(msg);
      },
        {
          noAck: false,
          consumerTag: 'lyrics_section'
        });
    }
    catch (ex) {
      this.logger.error('Failed to connect: ' + ex);
    }
  }
}
