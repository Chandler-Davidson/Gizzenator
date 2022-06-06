import { firestore } from 'database';

const kglw = "King Gizzard & The Lizard Wizard";

export async function fetchSection(req, resp) {
  resp.send(await findRandomSection(kglw));
}

export async function findRandomSection(artist = kglw) {
  const { title, sections } = await findRandomSong(artist);
  const sectionIndex = randomInteger(0, sections.length - 1);

  return {
    title,
    artist,
    text: sections[sectionIndex]
  };
}

function* buildRandomSongQuery(artist) {
  const songRef = firestore.collection('songs');

  for (const value of [randomInteger(0, Number.MAX_SAFE_INTEGER).toString(), '']) {
    yield songRef
      .where('artist', '==', artist)
      .where('__name__', '>=', value)
      .orderBy('__name__').limit(1).get();
  }
}

async function findRandomSong(artist) {
  for (const query of buildRandomSongQuery(artist)) {
    const snapshot = await query;
    if (!snapshot.empty) {
      return snapshot.docs.at(0).data();
    }
  }
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}