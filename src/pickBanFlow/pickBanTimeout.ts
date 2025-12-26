import { PICK_BAN_CONFIGS } from "@/constants";
import { StepAction, type ExtendedClient } from "@/models";
import type { ButtonInteraction } from "discord.js";
import { mapPickHandler } from "./buttonActions/mapPickHandler";
import { banHandler } from "./buttonActions/banHandler";
import { sidePickHandler } from "./buttonActions/sidePickHandler";
import { updateInteractionResponse } from "./updateInteractionResponse";
import { isNextStepLast } from "./isNextStepLast";
import { handlePickBanFinish } from "./handlePickBanFinish";

export const scheduleStepTimeout = (interaction: ButtonInteraction) => {
  const client = interaction.client as ExtendedClient;
  const channelId = interaction.channelId;

  const pickBanState = client.pickBanStates.get(channelId);
  if (!pickBanState) return;
  const { timeoutId, timePerAction } = pickBanState;

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  pickBanState.timeoutId = setTimeout(async () => {
    const originalState = client.pickBanStates.get(channelId);
    if (!originalState) return;

    const step = PICK_BAN_CONFIGS[originalState.configKey].steps[originalState.currentStepIndex];

    if (!step) return;

    switch (step.action) {
      case StepAction.SIDE_PICK:
        await sidePickHandler(interaction, true);
        break;
      case StepAction.MAP_PICK:
        await mapPickHandler(interaction, true);
        break;
      case StepAction.BAN:
        await banHandler(interaction, true);
        break;
      default:
        return;
    }

    await updateInteractionResponse(interaction);

    if (isNextStepLast(interaction)) {
      await handlePickBanFinish(interaction);
      return;
    }

    scheduleStepTimeout(interaction);
  }, timePerAction * 1000);
};
