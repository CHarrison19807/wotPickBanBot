import type { ExtendedClient } from "@/models";
import type { ButtonInteraction } from "discord.js";
import { automaticBanHandler } from "../automaticActions/automaticBanHandler";

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
