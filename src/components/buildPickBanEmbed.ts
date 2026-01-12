import { PICK_BAN_CONFIGS } from "@/constants";
import { ActingTeam, StepAction, type PickBanState } from "@/models";

export const buildPickBanEmbed = (pickBanState: PickBanState) => {
  const { log, channelId, configKey, currentStepIndex, teamACaptainId, teamBCaptainId } = pickBanState;

  const currentStep = PICK_BAN_CONFIGS[configKey].steps[currentStepIndex];
  let actionText = "";
  const actingTeam = currentStep?.actingTeam;

  if (actingTeam) {
    actionText += actingTeam === ActingTeam.TEAM_A ? `<@${teamACaptainId}>` : `<@${teamBCaptainId}>`;
    actionText += " - ";
  }

  if (currentStep) {
    actionText +=
      currentStep.action === StepAction.SIDE_PICK
        ? "pick a side"
        : currentStep.action === StepAction.MAP_PICK
          ? "pick a map"
          : "ban a map or a tank";
  }

  if (currentStep?.action === StepAction.DECIDER) {
    actionText = "";
  }

  if (!actionText) {
    actionText = "Pick/Ban completed.";
  }

  const description = log.join("\n") + `\n\n**${actionText}**`;
  const embed = {
    title: `Pick/Ban for Match ${channelId}`,
    description,
  };
  return [embed];
};
