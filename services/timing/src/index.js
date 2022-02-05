import Fastify from 'fastify'
import { registerRoutes } from './routes/index.js';

const fastify = Fastify({
  logger: true
});

registerRoutes(fastify);

async function main() {
  await fastify.listen(3030, '0.0.0.0');
}

main();