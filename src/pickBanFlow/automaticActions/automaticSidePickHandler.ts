import type { ExtendedClient } from "../../models";
import type { ButtonInteraction } from "discord.js";

export const automaticSidePickHandler = async (interaction: ButtonInteraction) => {
  const client = interaction.client as ExtendedClient;
  const channelId = interaction.channelId;

  const currentPickBanState = client.pickBanStates.get(interaction.channelId);

  if (!currentPickBanState) {
    await interaction.reply({ content: "Pick/Ban state not found for this channel.", ephemeral: true });
    return;
  }

  const { currentStepIndex, pickedMaps, log } = currentPickBanState;

  const lastPickedMap = pickedMaps[pickedMaps.length - 1];

  if (!lastPickedMap) {
    await interaction.reply({ content: "No picked map found for automatic side selection.", ephemeral: true });
    return;
  }

  const randomSide = lastPickedMap.sideOptions[Math.floor(Math.random() * lastPickedMap.sideOptions.length)];

  const finalMapObj = {
    ...lastPickedMap,
    firstSide: randomSide,
  };

  const newPickBanState = {
    ...currentPickBanState,
    currentStepIndex: currentStepIndex + 1,
    pickedMaps: [...pickedMaps.slice(0, -1), finalMapObj],
    log: [...log, `Time expired - ${randomSide} was randomly selected for ${lastPickedMap.name}.`],
  };

  client.pickBanStates.set(channelId, newPickBanState);
};
