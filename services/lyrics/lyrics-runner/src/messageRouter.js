import config from "config";
import { Genius } from "genius";
import PrismaClient from "@prisma/client";

const prisma = new PrismaClient.PrismaClient();
const genius = new Genius(config.get("Genius"));

async function fetchLyrics(artist, titles) {
  return (await Promise.allSettled(
    titles.map(t => genius.lyricSections(artist, t))
  )).map(({ value }) => value);
}

export async function messageRouter(msg, logger) {
  try {
    const { artist: artistName, songs } = JSON.parse(msg.content);
    const songIdLookup = Object.fromEntries(songs.map(({ title, id }) => [title, id]));
    const lyrics = (await fetchLyrics(artistName, songs.map(({ title }) => title))).filter(l => l);

    await prisma.section.createMany({
      data: lyrics.flatMap(song => song.sections.map(section => ({
        text: section,
        songId: songIdLookup[song.title]
      }))),
      skipDuplicates: true
    });

  } catch (err) {
    logger.error(err);
    return false;
  }

  return true;
}