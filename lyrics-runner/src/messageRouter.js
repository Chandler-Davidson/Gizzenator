import config from "config";
import { Genius } from "genius";
import { firestore, FieldValue } from "database";

const genius = new Genius(config.get("Genius"));

async function fetchLyrics(artist, titles) {
  return (await Promise.allSettled(
    titles.map(t => genius.lyricSections(artist, t))
  )).map(({ value }) => value).filter(v => v);
}

export async function messageRouter(msg, logger) {
  try {
    const { artist: artistName, songs: songTitles } = msg;

    const artistRef = firestore.collection('artists').doc(artistName);
    const songRef = firestore.collection('songs');

    if (!(await artistRef.get()).exists) {
      console.log(`Artist: ${artistName} doesn't exist.`);
      return;
    }

    const songs = (await fetchLyrics(artistName, songTitles))
      .map(({ sections, title }) => ({ sections, title, artist: artistName }))
      .filter(({ sections }) => sections.length > 0);

    await Promise.allSettled(songs.map(s => songRef.add(s)));
  } catch (err) {
    console.log(err);
    return false;
  }

  return true;
}
