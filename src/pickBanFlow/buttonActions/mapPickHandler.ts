import type { ExtendedClient } from "@/models";
import type { ButtonInteraction } from "discord.js";
import { automaticMapPickHandler } from "../automaticActions/automaticMapPickHandler";

export const mapPickHandler = async (interaction: ButtonInteraction, isAutomatic = false) => {
  const client = interaction.client as ExtendedClient;
  const { channelId, customId, user } = interaction;

  if (isAutomatic) {
    await automaticMapPickHandler(interaction);
    return;
  }

  const currentPickBanState = client.pickBanStates.get(interaction.channelId);

  if (!currentPickBanState) {
    await interaction.reply({ content: "Pick/Ban state not found for this channel.", ephemeral: true });
    return;
  }
  const { currentStepIndex, availableMaps, pickedMaps, log } = currentPickBanState;

  const [_channelId, mapName, _stepAction] = customId.split("-");

  const pickedMap = availableMaps.find((m) => m.name === mapName);

  if (!pickedMap) {
    await interaction.reply({ content: "No matching available map found for ban.", ephemeral: true });
    return;
  }

  const newPickBanState = {
    ...currentPickBanState,
    currentStepIndex: currentStepIndex + 1,
    pickedMaps: [...pickedMaps, pickedMap],
    availableMaps: availableMaps.filter((m) => m.name !== mapName),
    log: [...log, `${mapName} was picked by <@${user.id}>.`],
  };

  client.pickBanStates.set(channelId, newPickBanState);
};
