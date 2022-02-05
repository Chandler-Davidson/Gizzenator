import amqp from "amqplib";
import { chunk } from "../../lib/util.js";

const queueName = "lyrics.parse_sections";

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

  createJobs(artist) {
    return chunk(artist.songs, 3).map(titles =>
      this.channel.sendToQueue(queueName,
        encode({
          artist: artist.name,
          songs: titles
        })));
  }
}

const encode = obj => Buffer.from(JSON.stringify(obj));