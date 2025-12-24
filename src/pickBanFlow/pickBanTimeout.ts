import { buildPickBanButtons } from "@/components/buildPickBanButtons";
import { buildPickBanEmbed } from "@/components/buildPickBanEmbed";
import { PICK_BAN_CONFIGS, STEP_TIMEOUT_MS } from "@/constants";
import { StepAction, type ExtendedClient, type Map } from "@/models";
import type { ButtonInteraction, ChatInputCommandInteraction } from "discord.js";

export const scheduleStepTimeout = (interaction: ButtonInteraction, client: ExtendedClient, channelId: string) => {
  const pickBanState = client.pickBanStates.get(channelId);
  if (!pickBanState) return;

  if (pickBanState.timeoutId) {
    clearTimeout(pickBanState.timeoutId);
  }

  pickBanState.timeoutId = setTimeout(async () => {
    const originalState = client.pickBanStates.get(channelId);
    if (!originalState) return;

    const step = PICK_BAN_CONFIGS[originalState.configKey].steps[originalState.currentStepIndex];

    if (!step) return;

    let updatedMap: Map;

    switch (step.action) {
      case StepAction.SIDE_PICK:
        const lastPickedMap = originalState.pickedMaps[originalState.pickedMaps.length - 1];
        if (!lastPickedMap) {
          return;
        }
        const randomSide = lastPickedMap.sideOptions[Math.floor(Math.random() * lastPickedMap.sideOptions.length)]!;

        updatedMap = {
          ...lastPickedMap,
          firstSide: randomSide,
        };
        break;
      case StepAction.MAP_PICK:
        break;
      case StepAction.BAN:
        break;
      default:
        return;
    }

    const actingTeamRoleId = step.actingTeam === "TEAM_A" ? originalState.teamARoleId : originalState.teamBRoleId;

    // Auto action
    const randomMap = originalState.availableMaps[Math.floor(Math.random() * originalState.availableMaps.length)];

    if (!randomMap) return;

    if (step.action === StepAction.BAN) {
      originalState.bannedMaps.push(randomMap);
    } else {
      originalState.pickedMaps.push(randomMap);
    }

    originalState.availableMaps = originalState.availableMaps.filter((m) => m.name !== randomMap.name);

    originalState.currentStepIndex++;

    // Update message
    const channel = await client.channels.fetch(channelId);
    if (!channel?.isTextBased()) return;

    originalState.log = [
      ...originalState.log,
      `Time expired - ${randomMap.name} was ${
        step.action === StepAction.BAN ? "banned" : "picked"
      } randomly - <@&${actingTeamRoleId}>.`,
    ];

    await interaction.editReply({
      content: originalState.log.join("\n"),
      embeds: buildPickBanEmbed(originalState),
      components: buildPickBanButtons(originalState),
    });

    scheduleStepTimeout(interaction, client, channelId);

    client.pickBanStates.set(channelId, originalState);
  }, STEP_TIMEOUT_MS);
};
