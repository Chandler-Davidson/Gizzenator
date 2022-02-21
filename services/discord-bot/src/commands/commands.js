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
      description: 'When should I send lyrics? Accepts a generic timeframe or a cron schedule.',
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
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  },
  'gizzbreak': async interaction => {
    try {
      const guildId = interaction.guildId;
      const response = await axios.delete(`http://localhost:3000/schedules/${guildId}`);
    } catch (err) {
      console.log(err);
    }
  }
};

