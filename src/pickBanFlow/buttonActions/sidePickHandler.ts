import { Side, type ExtendedClient } from "../../models";
import type { ButtonInteraction } from "discord.js";
import { automaticSidePickHandler } from "../automaticActions/automaticSidePickHandler";

export const sidePickHandler = async (interaction: ButtonInteraction, isAutomatic = false) => {
  const client = interaction.client as ExtendedClient;
  const { channelId, customId, user } = interaction;

  if (isAutomatic) {
    await automaticSidePickHandler(interaction);
    return;
  }

  const currentPickBanState = client.pickBanStates.get(interaction.channelId);

  if (!currentPickBanState) {
    await interaction.reply({ content: "Pick/Ban state not found for this channel.", ephemeral: true });
    return;
  }
  const { currentStepIndex, availableMaps, pickedMaps, log } = currentPickBanState;

  const [_channelId, mapName, mapSide] = customId.split("-") as [string, string, Side];

  const pickedMap = pickedMaps.find((m) => m.name === mapName);
  if (!pickedMap) {
    await interaction.reply({ content: "No matching picked map found for side pick.", ephemeral: true });
    return;
  }

  const finalMapObj = {
    ...pickedMap,
    firstSide: mapSide,
  };

  const newPickBanState = {
    ...currentPickBanState,
    currentStepIndex: currentStepIndex + 1,
    pickedMaps: [...pickedMaps.filter((m) => m.name !== mapName), finalMapObj],
    availableMaps: availableMaps.filter((m) => m.name !== mapName),
    log: [...log, `${mapName} ${mapSide} was picked by <@${user.id}>.`],
  };

  client.pickBanStates.set(channelId, newPickBanState);
};
