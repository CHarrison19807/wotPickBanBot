import { buildPickBanButtons } from "@/components/buildPickBanButtons";
import { buildPickBanEmbed } from "@/components/buildPickBanEmbed";
import { PICK_BAN_CONFIGS } from "@/constants";
import { ActingTeam, Side, StepAction, type ExtendedClient } from "@/models";
import { scheduleStepTimeout } from "@/pickBanFlow/pickBanTimeout";
import type { ButtonInteraction } from "discord.js";

export const pickMapButtonHandler = async (interaction: ButtonInteraction, client: ExtendedClient) => {
  const { customId, channelId, user } = interaction;
  const pickBanState = client.pickBanStates.get(channelId);

  if (!pickBanState) {
    await interaction.reply({ content: "Pick/Ban state not found for this channel.", ephemeral: true });
    return;
  }

  const {
    configKey,
    currentStepIndex,
    teamACaptainId,
    teamBCaptainId,
    pickedMaps,
    availableMaps,
    teamARoleId,
    teamBRoleId,
    log,
  } = pickBanState;
  const [_, mapName, stepAction] = customId.split("-");

  const currentStep = PICK_BAN_CONFIGS[configKey].steps[currentStepIndex];
  if (!currentStep) {
    await interaction.reply({ content: "Invalid pick/ban step.", ephemeral: true });
    return;
  }

  if (currentStep.action !== StepAction.MAP_PICK || stepAction !== StepAction.MAP_PICK) {
    throw new Error("Current step is not a map pick action");
  }

  const actingTeamCaptainId = currentStep.actingTeam === ActingTeam.TEAM_A ? teamACaptainId : teamBCaptainId;
  const actingTeamRoleId = currentStep.actingTeam === ActingTeam.TEAM_A ? teamARoleId : teamBRoleId;

  if (user.id !== actingTeamCaptainId) {
    await interaction.reply({ content: "You are not authorized to pick a map at this step.", ephemeral: true });
    return;
  }
  const map = availableMaps.find((m) => m.name === mapName);

  if (!map) {
    await interaction.reply({ content: "No matching available map found for pick.", ephemeral: true });
    return;
  }

  pickBanState.pickedMaps = [...pickedMaps, map];
  pickBanState.availableMaps = availableMaps.filter((m) => m.name !== mapName);
  pickBanState.log = [...log, `"${mapName}" was picked by <@${user.id}> - <@&${actingTeamRoleId}>.`];

  pickBanState.currentStepIndex += 1;
  client.pickBanStates.set(channelId, pickBanState);

  scheduleStepTimeout(interaction, client, channelId);

  await interaction.update({
    content: pickBanState.log.join("\n"),
    embeds: buildPickBanEmbed(pickBanState),
    components: buildPickBanButtons(pickBanState),
  });
};
