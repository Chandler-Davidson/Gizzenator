import config from "config";
import { Client, Intents } from "discord.js";
import { commandHandlers } from "./commands/commands.js";
import { formatResponse } from "./lib/getLyrics.js";
import { QueueConsumer } from "queue";

const { url, sendQueueName } = config.get("RabbitMQ");
const queueConsumer = new QueueConsumer(url, sendQueueName);
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});

async function main() {
  await client.login(config.get("Discord.token"));

  await queueConsumer.connect();
  await queueConsumer.consume(handleMessage);
}

main();


client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  await commandHandlers[interaction.commandName](interaction);
});

async function handleMessage(message) {
  try {
    const { ids, lyrics } = message;
    const channels = ids.map(id => client.channels.cache.get(id)).filter(c => c);

    for (const channel of channels) {
      channel.send(formatResponse(lyrics.text, lyrics.title, lyrics.artist))
    }
  } catch (err) {
    console.log(err);
  }

  return true;
}

