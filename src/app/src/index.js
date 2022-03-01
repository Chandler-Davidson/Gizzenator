import fastify from "fastify";
import { registerRoutes } from "./routes/index.js";
import { createLogger } from "logger";

const logger = createLogger('api');
const app = fastify({ logger: true });

process.on("SIGTERM", async () => {
  logger.info('Closing...');
  await app.close();
  process.exit(0);
});

async function main() {
  try {
    registerRoutes(app, logger);
    const port = 3000;
    await app.listen(port, '0.0.0.0');
    logger.info(`Ready and listening on port: ${port}`);
  } catch (err) {
    console.error(err);
    logger.error(err);
    process.exit(1);
  }
}

main();
