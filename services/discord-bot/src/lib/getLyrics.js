export async function getLyricMessage() {
  const { text, song } = (await axios.get('http://localhost:3000/lyrics')).data;
  return formatResponse(text, song, song.artist);
}

export function formatResponse(text, song, artist) {
  return `${text}\n\n${song.title} by ${artist.name}`;
}