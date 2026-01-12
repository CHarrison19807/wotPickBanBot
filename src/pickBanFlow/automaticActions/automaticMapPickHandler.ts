import type { ExtendedClient } from "../../models";
import type { ButtonInteraction } from "discord.js";

export const automaticMapPickHandler = async (interaction: ButtonInteraction) => {
  const client = interaction.client as ExtendedClient;
  const channelId = interaction.channelId;

  const currentPickBanState = client.pickBanStates.get(interaction.channelId);

  if (!currentPickBanState) {
    await interaction.reply({ content: "Pick/Ban state not found for this channel.", ephemeral: true });
    return;
  }

  const { currentStepIndex, availableMaps, pickedMaps, log } = currentPickBanState;

  const randomAvailableMap = availableMaps[Math.floor(Math.random() * availableMaps.length)];

  if (!randomAvailableMap) {
    await interaction.reply({ content: "No available maps found for automatic pick.", ephemeral: true });
    return;
  }

  const newPickBanState = {
    ...currentPickBanState,
    currentStepIndex: currentStepIndex + 1,
    pickedMaps: [...pickedMaps, randomAvailableMap],
    availableMaps: availableMaps.filter((m) => m.name !== randomAvailableMap.name),
    log: [...log, `Time expired - ${randomAvailableMap.name} was randomly picked.`],
  };

  client.pickBanStates.set(channelId, newPickBanState);
};
