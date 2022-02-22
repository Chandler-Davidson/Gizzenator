import { createRefreshJob } from "./lyrics/createRefreshJob.js";
import { fetchSection } from "./lyrics/fetchSection.js";
import { updateSchedule } from "./schedules/updateSchedule.js";
import { deleteSchedule } from "./schedules/deleteSchedule.js";

export function registerRoutes(app) {
  app.post("/lyrics", (req, resp) => createRefreshJob(req, resp));
  app.get("/lyrics", (req, resp) => fetchSection(req, resp));

  app.put('/schedules', (req, resp) => updateSchedule(req, resp));
  app.delete('/schedules/:channelId', (req, resp) => deleteSchedule(req, resp));
}
