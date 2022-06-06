import axios from 'axios';

export async function getLyricMessage() {
  const {data} = (await axios.get('http://localhost:3000/lyrics'));
  const { text, title, artist } = data;
  return formatResponse(text, title, artist);
}

export function formatResponse(text, title, artist) {
  return `${text}\n\n${title} by ${artist}`;
}