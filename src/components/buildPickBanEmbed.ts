import { PICK_BAN_CONFIGS } from "@/constants";
import { ActingTeam, StepAction, type PickBanState } from "@/models";

export const buildPickBanEmbed = (pickBanState: PickBanState) => {
  const { log, channelId, configKey, currentStepIndex } = pickBanState;

  const currentStep = PICK_BAN_CONFIGS[configKey].steps[currentStepIndex];
  let actionText = "";
  const actingTeam = currentStep?.actingTeam;

  if (actingTeam) {
    actionText += actingTeam === ActingTeam.TEAM_A ? "Team A" : "Team B";
    actionText += " - ";
  }

  if (currentStep) {
    actionText +=
      currentStep.action === StepAction.SIDE_PICK
        ? "pick a side"
        : currentStep.action === StepAction.MAP_PICK
          ? "pick a map"
          : "ban a map";
  }

  if (currentStep?.action === StepAction.DECIDER) {
    actionText = "";
  }

  if (!actionText) {
    actionText = "Pick/Ban complete.\nGood luck to both teams!";
  }

  const description = log.join("\n") + `\n\n**${actionText}**`;
  const embed = {
    title: `Pick/Ban for Match ${channelId}`,
    description,
  };
  return [embed];
};
