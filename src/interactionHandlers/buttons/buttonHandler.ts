import { StepAction, type ExtendedClient } from "@/models";
import type { ButtonInteraction } from "discord.js";
import { pickSideButtonHandler } from "./pickSideButton";
import { PICK_BAN_CONFIGS } from "@/constants";
import { banMapButtonHandler } from "./banMapButton";
import { pickMapButtonHandler } from "./pickMapButton";

export const buttonHandler = async (interaction: ButtonInteraction) => {
  const { channelId } = interaction;
  const client = interaction.client as ExtendedClient;
  const pickBanState = client.pickBanStates.get(channelId);

  if (!pickBanState) {
    await interaction.reply({ content: "Pick/Ban state not found for this channel.", ephemeral: true });
    return;
  }

  const { currentStepIndex, configKey, timeoutId } = pickBanState;

  const currentStep = PICK_BAN_CONFIGS[configKey].steps[currentStepIndex];
  if (!currentStep) {
    await interaction.reply({ content: "Invalid pick/ban step.", ephemeral: true });
    return;
  }

  if (timeoutId) {
    clearTimeout(timeoutId);
    pickBanState.timeoutId = null;
    client.pickBanStates.set(channelId, pickBanState);
  }

  switch (currentStep.action) {
    case StepAction.SIDE_PICK:
      await pickSideButtonHandler(interaction, client);
      break;

    case StepAction.MAP_PICK:
      await pickMapButtonHandler(interaction, client);
      break;

    case StepAction.BAN:
      await banMapButtonHandler(interaction, client);
      break;

    case StepAction.DECIDER:
      // Implement decider button handler when needed
      await interaction.reply({ content: "Decider action is not yet implemented.", ephemeral: true });
      break;
    default:
      await interaction.reply({ content: "This action is not yet implemented.", ephemeral: true });
  }
};
