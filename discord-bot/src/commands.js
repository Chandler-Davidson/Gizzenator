import axios from 'axios';

export const commands = [
  {
    name: "gizzify",
    description: "Replies some Gizz lyrics!",
    execute: async interaction => {
      try {
      const { text, song } = (await axios.get('http://localhost:3000/')).data;
      interaction.reply(formatResponse(text, song, song.artist));
      } catch(err) {
        console.log(err);
      }
    }
  },
];

function formatResponse(text, song, artist) {
  return `${text}\n\n${song.title} by ${artist.name}`;
}