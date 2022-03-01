import axios from 'axios';
import { getLyricMessage } from '../lib/getLyrics.js';

export const commands = [
  {
    name: 'gizzify',
    description: 'Replies some Gizz lyrics!',
  },
  {
    name: 'ourdailygizz',
    description: 'Schedule some reocurring Gizz lyrics!',
    options: [{
      name: 'schedule',
      type: 'STRING',
      description: 'When should I send lyrics? Accepts a generic cron schedule.',
      required: true
    }]
  },
  {
    name: 'gizzbreak',
    description: 'Remove reocurring lyrics'
  }
];

export const commandHandlers = {
  "gizzify": async interaction => {
    try {
      interaction.reply(await getLyricMessage());
    } catch (err) {
      console.log(err);
    }
  },
  "ourdailygizz": async interaction => {
    try {
      const cronExpression = interaction.options.getString('schedule');
      const channelId = interaction.channelId;
      const response = await axios.put('http://localhost:3000/schedules', { cronExpression, channelId })

      interaction.reply('Aight, I got you later');
    } catch (err) {
      if (err.response.status === 400) {
        interaction.reply("That schedule doesn't seem right...");
        return;
      }

      console.error(err);
    }
  },
  'gizzbreak': async interaction => {
    try {
      const channelId = interaction.channelId;
      const response = await axios.delete(`http://localhost:3000/schedules/${channelId}`);
      interaction.reply('No sweat, come back later');
    } catch (err) {
      console.log(err);
    }
  }
};

