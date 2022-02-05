import config from "config";
import { Client, Intents } from "discord.js";
import { commands } from "./commands/commands.js";
import { registerCommands } from "./commands/registerCommands.js";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});

client.on('guildCreate', ({ id }) => registerCommands(id));

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  const command = commands.find(({ name }) => name === interaction.commandName);
  await command.execute(interaction);
});

client.login(config.get("Discord.token"));
