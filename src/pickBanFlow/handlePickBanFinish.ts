import type { ExtendedClient } from "@/models";
import type { ButtonInteraction } from "discord.js";
import { updateInteractionResponse } from "./updateInteractionResponse";

export const handlePickBanFinish = async (interaction: ButtonInteraction) => {
  const client = interaction.client as ExtendedClient;
  const channelId = interaction.channelId;
  const pickBanState = client.pickBanStates.get(channelId);

  if (!pickBanState) return;

  const availableMaps = pickBanState.availableMaps;

  if (availableMaps.length === 0 || availableMaps[0] === undefined) {
    throw new Error("No available maps to finalize pick/ban.");
  }

  const deciderMap = availableMaps[Math.floor(Math.random() * availableMaps.length)];

  if (!deciderMap) {
    throw new Error("Decider map could not be determined.");
  }

  const finalPickBanState = {
    ...pickBanState,
    pickedMaps: [...pickBanState.pickedMaps, deciderMap],
    log: [...pickBanState.log, `Decider map is ${deciderMap.name}.`],
  };

  client.pickBanStates.set(channelId, finalPickBanState);

  await updateInteractionResponse(interaction);
};
