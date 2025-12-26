import { PICK_BAN_CONFIGS } from "@/constants";
import type { ExtendedClient } from "@/models";
import type { ButtonInteraction } from "discord.js";

export const isNextStepLast = (interaction: ButtonInteraction) => {
  const client = interaction.client as ExtendedClient;
  const channelId = interaction.channelId;
  const pickBanState = client.pickBanStates.get(channelId);

  if (!pickBanState) return false;

  const { configKey, currentStepIndex } = pickBanState;

  const steps = PICK_BAN_CONFIGS[configKey].steps;

  return currentStepIndex >= steps.length - 1;
};
