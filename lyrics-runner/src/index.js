import config from "config";
import { QueueConsumer } from "queue";
import { createLogger } from "logger";
import { messageRouter } from "./messageRouter.js";

const logger = createLogger('lyrics-queue-consumer');
const { url, parseQueueName } = config.get("RabbitMQ");
const consumer = new QueueConsumer(url, parseQueueName);

process.once('SIGINT', async () => {
  logger.info('Closing...');
  await consumer.closeConnection();
  process.exit(0);
});

async function main() {
  await consumer.connect();
  await consumer.consume(messageRouter);
}

main();
