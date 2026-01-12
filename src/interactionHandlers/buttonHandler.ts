import { ActingTeam, StepAction, type ExtendedClient } from "../models";
import { MessageFlags, type ButtonInteraction } from "discord.js";
import { PICK_BAN_CONFIGS } from "../constants";
import { updateInteractionResponse } from "../pickBanFlow/updateInteractionResponse";
import { isNextStepLast } from "../pickBanFlow/isNextStepLast";
import { handlePickBanFinish } from "../pickBanFlow/handlePickBanFinish";
import { scheduleStepTimeout } from "../pickBanFlow/pickBanTimeout";
import { banHandler } from "../pickBanFlow/buttonActions/banHandler";
import { mapPickHandler } from "../pickBanFlow/buttonActions/mapPickHandler";
import { sidePickHandler } from "../pickBanFlow/buttonActions/sidePickHandler";

export const buttonHandler = async (interaction: ButtonInteraction) => {
  const { channelId, user } = interaction;
  const client = interaction.client as ExtendedClient;
  const pickBanState = client.pickBanStates.get(channelId);

  console.log("Button interaction received:", interaction.customId);

  if (!pickBanState) {
    await interaction.reply({ content: "Pick/Ban state not found for this channel.", ephemeral: true });
    return;
  }

  const { currentStepIndex, configKey, timeoutId, isProcessing, teamACaptainId, teamBCaptainId } = pickBanState;
  const currentStep = PICK_BAN_CONFIGS[configKey].steps[currentStepIndex];

  if (!currentStep) {
    await interaction.reply({ content: "Invalid pick/ban step.", ephemeral: true });
    return;
  }

  const currentTeamActing = currentStep.actingTeam;
  const userId = user.id;
  const actingTeamCaptainId = currentTeamActing === ActingTeam.TEAM_A ? teamACaptainId : teamBCaptainId;

  if (userId !== actingTeamCaptainId) {
    await interaction.reply({
      content: `Only the captain of ${currentTeamActing === ActingTeam.TEAM_A ? "Team A" : "Team B"} can perform this action.`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  if (isProcessing) {
    console.log("Another action is currently being processed. Ignoring this interaction.");
    return;
  }

  const newPickBanState = { ...pickBanState, isProcessing: true };
  client.pickBanStates.set(channelId, newPickBanState);

  if (timeoutId) {
    clearTimeout(timeoutId);
    pickBanState.timeoutId = null;
    client.pickBanStates.set(channelId, pickBanState);
  }
  try {

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
      console.log(interaction.id);
      await banHandler(interaction);
      break;
    }
    default: {
      throw new Error("Unknown action type in pick/ban flow.");
    }
  }

} catch (error) {
    client.pickBanStates.set(channelId, { ...pickBanState, isProcessing: false });
    console.error("Error during button handling:", error);
    return;
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
