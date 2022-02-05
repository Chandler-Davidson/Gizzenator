import config from "config";
import { Genius } from "genius";
import PrismaClient from "@prisma/client";
const genius = new Genius(config.get("Genius"));
const prisma = new PrismaClient.PrismaClient();

export async function createJob(producer, logger, request, response) {
  const { artist: artistName } = request.body;

  let artist = await fetchArtist(artistName);

  if (artist) {
    logger.warn(`Artist already exists: ${artistName}`);
    response.code(400).send({ message: "Artist already exists" });
    return;
  }

  const songs = await genius.topSongs(artistName);
  artist = await createArtist(artistName, songs);

  const jobs = producer.createJobs(artist);
  response.code(jobs.every(j => j) ? 200 : 500).send();
  logger.info(`Creating ${jobs.length} new jobs`);
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