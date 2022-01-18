import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import config from "config";
import { commands } from "../src/commands.js";

const { token, clientId, guildId } = config.get("Discord");
const rest = new REST({ version: "9" }).setToken(token);

const slashCommands = commands.map(({ name, description }) =>
  new SlashCommandBuilder().setName(name).setDescription(description).toJSON()
);

rest.put(Routes.applicationGuildCommands(clientId, guildId), {
  body: slashCommands,
})
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
