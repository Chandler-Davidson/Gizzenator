import config from "config";
import { QueueConsumer } from "./queueConsumer.js";
import { createLogger } from "logger";

const logger = createLogger('lyrics-queue-consumer');
const consumer = new QueueConsumer(config.get("RabbitMQ"), logger);
  
process.once('SIGINT', async () => {
  logger.info('Closing...');
  await consumer.closeConnection();
  process.exit(0);
});

async function main() {
  await consumer.connect();
  await consumer.consume();
}

main();
