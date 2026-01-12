import type { ExtendedClient } from "../../models";
import type { ButtonInteraction } from "discord.js";

export const automaticBanHandler = async (interaction: ButtonInteraction) => {
  console.log("inside automaticBanHandler");

  const client = interaction.client as ExtendedClient;
  const channelId = interaction.channelId;

  const currentPickBanState = client.pickBanStates.get(channelId);

  if (!currentPickBanState) {
    await interaction.reply({ content: "Pick/Ban state not found for this channel.", ephemeral: true });
    return;
  }

  const { currentStepIndex, availableMaps, bannedMaps, log } = currentPickBanState;

  const randomAvailableMap = availableMaps[Math.floor(Math.random() * availableMaps.length)];

  if (!randomAvailableMap) {
    await interaction.reply({ content: "No available maps found for automatic ban.", ephemeral: true });
    return;
  }

  const newPickBanState = {
    ...currentPickBanState,
    currentStepIndex: currentStepIndex + 1,
    bannedMaps: [...bannedMaps, randomAvailableMap],
    availableMaps: availableMaps.filter((m) => m.name !== randomAvailableMap.name),
    log: [...log, `Time expired - ${randomAvailableMap.name} was randomly banned.`],
  };

  client.pickBanStates.set(channelId, newPickBanState);
};
