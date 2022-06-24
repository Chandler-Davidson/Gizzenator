import { firestore, FieldPath} from 'database';

const kglw = "King Gizzard & The Lizard Wizard";

export async function fetchSection(req, resp) {
  resp.send(await findRandomSection(kglw));
}

export async function findRandomSection(artist = kglw) {
  const { title, sections } = await findRandomSong();
  const sectionIndex = randomInteger(0, sections.length - 1);

  return {
    title,
    artist,
    text: sections[sectionIndex]
  };
}

async function findRandomSong() {
  let songRef = firestore.collection("songs");
  const key = songRef.doc().id;

  for (const op of ['>=', '<']) {
    const snapshot = await songRef
    .where(FieldPath.documentId(), op, key)
      .limit(1).get();
    
    if (snapshot.size > 0) {
      return snapshot.docs[0].data();
    }
  }

  throw 'Unable to find random document';
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}