import config from "config";
import fastify from "fastify";
import { QueuePublisher } from "./queuePublisher.js";
import { registerRoutes } from "./routes/index.js";
import { createLogger } from "logger";

const logger = createLogger('lyrics-queue-producer');
const producer = new QueuePublisher(config.get("RabbitMQ"));
const app = fastify({ logger: true });

process.on("SIGTERM", async () => {
  logger.info('Closing...');
  await producer.closeConnection();
  await app.close();
  process.exit(0);
});

async function main() {
  try {
    registerRoutes(app, producer, logger);
    const port = 3000;
    await producer.connect();
    await app.listen(port, '0.0.0.0');
    logger.info(`Ready and listening on port: ${port}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

main();
