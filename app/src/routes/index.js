import { insertArtist } from "./artist.js";
import { fetchSection } from "./lyrics.js";
import { updateSchedule, deleteSchedule } from "./schedules.js";

export function registerRoutes(app) {
  app.get("/lyrics", (req, resp) => fetchSection(req, resp));
  app.post("/artist", (req, resp) => onlyAllowLocalConnections(req, resp, insertArtist));

  app.post('/schedules', (req, resp) => onlyAllowLocalConnections(req, resp, updateSchedule));
  app.put('/schedules', (req, resp) => onlyAllowLocalConnections(req, resp, updateSchedule));
  app.delete('/schedules/:channelId', (req, resp) => onlyAllowLocalConnections(req, resp, deleteSchedule));
}

function onlyAllowLocalConnections(req, resp, func) {
  const host = req.headers.host.split(':')[0];
  
  if (host !== 'localhost') {
    resp.send('Whatcha doin? 👀');
    
    return
  }

  func(req, resp);
}