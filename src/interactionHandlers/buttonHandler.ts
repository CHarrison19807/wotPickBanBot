import { StepAction, type ExtendedClient } from "@/models";
import type { ButtonInteraction } from "discord.js";
import { PICK_BAN_CONFIGS } from "@/constants";
import { updateInteractionResponse } from "@/pickBanFlow/updateInteractionResponse";
import { isNextStepLast } from "@/pickBanFlow/isNextStepLast";
import { handlePickBanFinish } from "@/pickBanFlow/handlePickBanFinish";
import { scheduleStepTimeout } from "@/pickBanFlow/pickBanTimeout";
import { banHandler } from "@/pickBanFlow/buttonActions/banHandler";
import { mapPickHandler } from "@/pickBanFlow/buttonActions/mapPickHandler";
import { sidePickHandler } from "@/pickBanFlow/buttonActions/sidePickHandler";

export const buttonHandler = async (interaction: ButtonInteraction) => {
  const { channelId } = interaction;
  const client = interaction.client as ExtendedClient;
  const pickBanState = client.pickBanStates.get(channelId);

  console.log("Button interaction received:", interaction.customId);

  if (!pickBanState) {
    await interaction.reply({ content: "Pick/Ban state not found for this channel.", ephemeral: true });
    return;
  }

  const { currentStepIndex, configKey, timeoutId, isProcessing } = pickBanState;

  if (isProcessing) {
    console.log("Another action is currently being processed. Ignoring this interaction.");
    return;
  }

  const newPickBanState = { ...pickBanState, isProcessing: true };
  client.pickBanStates.set(channelId, newPickBanState);

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
    case StepAction.SIDE_PICK: {
      await sidePickHandler(interaction);
      break;
    }

    case StepAction.MAP_PICK: {
      await mapPickHandler(interaction);
      break;
    }
    case StepAction.BAN: {
      await banHandler(interaction);
      break;
    }
    default: {
      console.log("default case reached in buttonHandler");
    }
  }

  await updateInteractionResponse(interaction);

  if (isNextStepLast(interaction)) {
    console.log("INSIDE LAST STEP HANDLER");
    await handlePickBanFinish(interaction);
    return;
  }

  scheduleStepTimeout(interaction);

  const updatedPickBanState = client.pickBanStates.get(channelId);
  if (updatedPickBanState) {
    const finalPickBanState = { ...updatedPickBanState, isProcessing: false };
    client.pickBanStates.set(channelId, finalPickBanState);
  }
};
