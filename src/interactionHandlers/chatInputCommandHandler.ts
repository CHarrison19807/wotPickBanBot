import { MessageFlags, type Client, type Collection, type ChatInputCommandInteraction } from "discord.js";
import "dotenv/config";
import type { Command } from "@/models";

interface ExtendedClient extends Client {
  commands: Collection<string, Command>;
}

export const chatInputCommandHandler = async (interaction: ChatInputCommandInteraction) => {
  const command = (interaction.client as ExtendedClient).commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
};
