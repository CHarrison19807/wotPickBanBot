import { buildPickBanButtons } from "@/components/buildPickBanButtons";
import { buildPickBanEmbed } from "@/components/buildPickBanEmbed";
import { PICK_BAN_CONFIGS } from "@/constants";
import { ActingTeam, Side, StepAction, type ExtendedClient, type Map } from "@/models";
import { scheduleStepTimeout } from "@/pickBanFlow/pickBanTimeout";
import type { ButtonInteraction } from "discord.js";

export const pickSideButtonHandler = async (interaction: ButtonInteraction, client: ExtendedClient) => {
  const { customId, channelId, user } = interaction;
  const pickBanState = client.pickBanStates.get(channelId);

  if (!pickBanState) {
    await interaction.reply({ content: "Pick/Ban state not found for this channel.", ephemeral: true });
    return;
  }

  const { configKey, currentStepIndex, pickedMaps, teamACaptainId, teamBCaptainId, log } = pickBanState;
  const [_, mapName, mapSide] = customId.split("-");

  const currentStep = PICK_BAN_CONFIGS[configKey].steps[currentStepIndex];
  if (!currentStep) {
    await interaction.reply({ content: "Invalid pick/ban step.", ephemeral: true });
    return;
  }

  if (currentStep.action !== StepAction.SIDE_PICK) {
    throw new Error("Current step is not a side pick action");
  }

  const actingTeamCaptainId = currentStep.actingTeam === ActingTeam.TEAM_A ? teamACaptainId : teamBCaptainId;
  const actingTeamRoleId =
    currentStep.actingTeam === ActingTeam.TEAM_A ? pickBanState.teamARoleId : pickBanState.teamBRoleId;

  if (user.id !== actingTeamCaptainId) {
    await interaction.reply({ content: "You are not authorized to pick a side for this step.", ephemeral: true });
    return;
  }

  const pickedMap = pickedMaps[pickedMaps.length - 1];
  if (!pickedMap || pickedMap.name !== mapName) {
    await interaction.reply({ content: "No matching picked map found for side selection.", ephemeral: true });
    return;
  }

  const finalMapObj: Map = {
    ...pickedMap,
    firstSide: mapSide as Side,
  };

  // Advance to the next step
  pickBanState.currentStepIndex += 1;
  pickBanState.pickedMaps = pickBanState.pickedMaps.slice(0, -1);
  pickBanState.pickedMaps = [...pickBanState.pickedMaps, finalMapObj];
  pickBanState.log = [...log, `"${mapSide}" selected for map "${mapName}" by <@${user.id}> - <@&${actingTeamRoleId}>.`];

  // Update the pick/ban state in the client
  client.pickBanStates.set(channelId, pickBanState);

  scheduleStepTimeout(interaction, client, channelId);

  await interaction.update({
    content: pickBanState.log.join("\n"),
    embeds: buildPickBanEmbed(pickBanState),
    components: buildPickBanButtons(pickBanState),
  });
};
