import { Client, GatewayIntentBits, Collection, Events } from "discord.js";
import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getCommandFiles } from "@/utils/getCommandFiles";
import { registerCommands } from "@/registerCommands";
import { chatInputCommandHandler } from "@/interactionHandlers/chatInputCommandHandler";
import type { ExtendedClient } from "@/models";
import { buttonHandler } from "./interactionHandlers/buttons/buttonHandler";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
}) as ExtendedClient;

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.commands = new Collection();
client.pickBanStates = new Collection();

const commandsPath = path.join(__dirname, "commands");

const commandFiles = getCommandFiles(commandsPath);

for (const filePath of commandFiles) {
  const command = await import(`file://${filePath}`);

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`[WARN] ${filePath} is missing "data" or "execute"`);
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    await chatInputCommandHandler(interaction);
  }

  if (interaction.isButton()) {
    await buttonHandler(interaction);
  }

  return;
});

await registerCommands();

client.login(process.env.DISCORD_TOKEN);

export { client };
