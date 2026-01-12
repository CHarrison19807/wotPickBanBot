import { REST, Routes } from "discord.js";
import "dotenv/config";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { getCommandFiles } from "./utils/getCommandFiles";
import type { Command } from "./models";

export const registerCommands = async () => {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.CLIENT_ID;

  if (!token || !clientId ) {
    throw new Error("Missing environment variables.");
  }

  // ESM-safe __dirname
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const commandsDir = path.join(__dirname, "commands");
  const commandFiles = getCommandFiles(commandsDir);

  const commands: Command[] = [];

  for (const filePath of commandFiles) {
    // ignore index files
    if (filePath.endsWith("index.ts")) {
      continue;
    }

    const fileUrl = pathToFileURL(filePath);
    const command = await import(fileUrl.href);

    if (command.data && command.execute) {
      commands.push(command.data.toJSON());
    } else {
      console.warn(`[WARN] ${filePath} is missing "data" or "execute"`);
    }
  }

  const rest = new REST({ version: "10" }).setToken(token);

  console.log(`Registering ${commands.length} application commands...`);

  const data = await rest.put(Routes.applicationCommands(clientId), { body: commands });

  console.log(`Successfully registered ${(data as unknown[]).length} commands.`);
};
