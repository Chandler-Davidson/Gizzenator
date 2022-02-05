import { createJob } from "./createJob.js";
import { section } from "./section.js";

export function registerRoutes(app, producer, logger) {
  app.post("/", async (req, resp) => await createJob(producer, logger, req, resp));
  app.get("/", async (req, resp) => await section(req, resp));
}

