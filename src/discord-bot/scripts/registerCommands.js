import config from "config";
import { Client, Intents } from "discord.js";
import { commands } from "../src/commands/commands.js";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});

client.login(config.get("Discord.token"));

client.on('ready', async () => {
  try {
    const registered = await client.application?.commands.set(commands);
    console.log(`Registered ${registered.size} commands`);
  } catch (err) {
    console.error(err);
  }
});
