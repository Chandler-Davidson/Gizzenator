import config from "config";
import { Genius } from "genius";
import { prisma } from "database";

const genius = new Genius(config.get("Genius"));

async function fetchLyrics(artist, titles) {
  return (await Promise.allSettled(
    titles.map(t => genius.lyricSections(artist, t))
  )).map(({ value }) => value);
}

export async function messageRouter(msg, logger) {
  try {
    const { artist: artistName, songs } = msg;
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
    return false;
  }

  return true;
}
