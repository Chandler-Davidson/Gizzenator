import config from "config";
import { prisma } from 'database'
import { Genius } from "genius";
import { chunk } from "../../lib/util.js";
import { QueueProducer } from "queue";

const genius = new Genius(config.get("Genius"));
const producer = new QueueProducer(config.get("RabbitMQ"), 'lyrics.parse_sections');
producer.connect();

export async function createRefreshJob(request, response) {
  const { artist: artistName } = request.body;

  let artist = await fetchArtist(artistName);

  if (artist) {
    console.warn(`Artist already exists: ${artistName}`);
    response.code(400).send({ message: "Artist already exists" });
    return;
  }

  const songs = await genius.topSongs(artistName);
  artist = await createArtist(artistName, songs);

  const jobs = chunk(artist.songs, 3).map(titles =>
    producer.createJob({artist: artist.name, songs: titles}));

  response.code(jobs.every(j => j) ? 200 : 500).send();
  console.info(`Creating ${jobs.length} new jobs`);
}

function fetchArtist(name) {
  return prisma.artist.findUnique({ where: { name } })
}

function createArtist(name, songTitles) {
  return prisma.artist.create({
    data: {
      name,
      songs: {
        create: songTitles.map(t => ({ title: t })),
      },
    },
    include: {
      songs: true
    }
  })
}