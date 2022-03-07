import config from "config";
import { chunk } from '../lib/util.js';
import { firestore } from 'database'
import { Genius } from "genius";
import { QueueProducer } from "queue";

const genius = new Genius(config.get("Genius"));
const { url, parseQueueName } = config.get("RabbitMQ");
const producer = new QueueProducer(url, parseQueueName);
producer.connect();

export async function insertArtist(request, response) {
  const { artist: artistName } = request.body;

  const artistRef = firestore.collection('artists');
  const artistDoc = artistRef.doc(artistName);

  if (artistDoc.exists) {
    console.warn(`Artist already exists: ${artistName}`);
    response.code(400).send({ message: "Artist already exists" });
    return;
  }

  await artistDoc.set({ name: artistName });
  const jobs = chunk(await genius.topSongs(artistName), 3).map(titles =>
    producer.createJob({ artist: artistName, songs: titles }));

  response.code(jobs.every(j => j) ? 200 : 500).send();
  console.info(`Creating ${jobs.length} new jobs`);
}
