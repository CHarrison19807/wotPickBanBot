import type { ExtendedClient } from "../../models";
import { MessageFlags, type ButtonInteraction, type TextChannel } from "discord.js";
import { automaticBanHandler } from "../automaticActions/automaticBanHandler";
import { TANK_BAN_NAME } from "../../constants";

export const banHandler = async (interaction: ButtonInteraction, isAutomatic = false) => {
  const client = interaction.client as ExtendedClient;
  const { channelId, customId, user } = interaction;

  if (isAutomatic) {
    await automaticBanHandler(interaction);
    return;
  }

  const currentPickBanState = client.pickBanStates.get(interaction.channelId);

  if (!currentPickBanState) {
    await interaction.reply({ content: "Pick/Ban state not found for this channel.", ephemeral: true });
    return;
  }
  const { currentStepIndex, availableMaps, bannedMaps, log } = currentPickBanState;

  const [_channelId, mapName, _stepAction] = customId.split("-");
  if (mapName === TANK_BAN_NAME) {
    const channel = interaction.channel as TextChannel;

    const messages = await channel.messages.fetch({ limit: 1 });
    const lastMessage = messages.first();

    if (lastMessage?.author.id !== user.id) {
      await interaction.reply({
        content: "The team captain must type the tank name before clicking the 'Tank Ban' button.",
        flags: MessageFlags.Ephemeral,
      });
      throw new Error("Team captain did not type the tank name before clicking the 'Tank Ban' button.");
    }

    const tankName = lastMessage.content.trim();

    const newPickBanState = {
      ...currentPickBanState,
      currentStepIndex: currentStepIndex + 1,
      log: [...log, `<@${user.id}> banned a tank: ${tankName}.`],
    };

    lastMessage.delete().catch((err) => console.error("Failed to delete tank ban message:", err));

    client.pickBanStates.set(channelId, newPickBanState);
    return;
  }
  const bannedMap = availableMaps.find((m) => m.name === mapName);

  if (!bannedMap) {
    await interaction.reply({ content: "No matching available map found for ban.", ephemeral: true });
    return;
  }

  const newPickBanState = {
    ...currentPickBanState,
    currentStepIndex: currentStepIndex + 1,
    bannedMaps: [...bannedMaps, bannedMap],
    availableMaps: availableMaps.filter((m) => m.name !== bannedMap.name),
    log: [...log, `${mapName} was banned by <@${user.id}>.`],
  };

  client.pickBanStates.set(channelId, newPickBanState);
};
