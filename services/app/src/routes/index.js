import { insertArtist } from "./artist/insertArtist.js";
import { fetchSection } from "./lyrics/fetchSection.js";
import { updateSchedule, deleteSchedule } from "./schedules.js";
// import { updateSchedule } from "./schedules/updateSchedule.js";
// import { deleteSchedule } from "./schedules/deleteSchedule.js";

export function registerRoutes(app) {
  app.get("/lyrics", (req, resp) => fetchSection(req, resp));
  app.post("/artist", (req, resp) => insertArtist(req, resp));

  app.post('/schedules', (req, resp) => updateSchedule(req, resp));
  app.put('/schedules', (req, resp) => updateSchedule(req, resp));
  app.delete('/schedules/:channelId', (req, resp) => deleteSchedule(req, resp));
}
