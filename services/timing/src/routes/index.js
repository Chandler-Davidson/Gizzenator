import PrismaClient from "@prisma/client";
import { upsertGuild } from './updateGuild.js';
import { deleteTiming } from './deleteGuild.js';

const prisma = new PrismaClient.PrismaClient();

export function registerRoutes(app) {
  app.put('/', (req, resp) => upsertGuild(prisma, req, resp));
  app.delete('/', (req, resp) => deleteTiming(prisma, req, resp));
}
