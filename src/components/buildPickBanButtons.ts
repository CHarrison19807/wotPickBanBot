import { PICK_BAN_CONFIGS, TANK_BAN_NAME } from "@/constants";
import type { PickBanState } from "@/models";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { StepAction } from "@/models";

export const buildPickBanButtons = (pickBanState: PickBanState) => {
  const rows: ActionRowBuilder<ButtonBuilder>[] = [];
  let row = new ActionRowBuilder<ButtonBuilder>();

  const { availableMaps, configKey, currentStepIndex, pickedMaps, channelId } = pickBanState;
  const stepAction = PICK_BAN_CONFIGS[configKey].steps[currentStepIndex]?.action;

  if (!stepAction) {
    throw new Error("Invalid current step index");
  }

  let buttonStyle: ButtonStyle;

  if (stepAction === StepAction.SIDE_PICK) {
    buttonStyle = ButtonStyle.Secondary;
    const pickedMap = pickedMaps[pickedMaps.length - 1];

    if (!pickedMap) {
      throw new Error("No map picked yet for side pick");
    }

    for (const side of pickedMap.sideOptions) {
      const mapName = pickedMap.name;

      row.addComponents(
        new ButtonBuilder().setLabel(side).setStyle(buttonStyle).setCustomId(`${channelId}-${mapName}-${side}`),
      );
    }

    rows.push(row);
  }

  if (stepAction === StepAction.MAP_PICK || stepAction === StepAction.BAN) {
    buttonStyle = stepAction === StepAction.MAP_PICK ? ButtonStyle.Success : ButtonStyle.Danger;

    for (const map of availableMaps) {
      if (row.components.length === 5) {
        rows.push(row);
        row = new ActionRowBuilder<ButtonBuilder>();
      }
      const mapName = map.name;

      row.addComponents(
        new ButtonBuilder()
          .setLabel(mapName)
          .setStyle(buttonStyle)
          .setCustomId(`${channelId}-${mapName}-${stepAction}`),
      );
    }
    if (stepAction === StepAction.BAN) {
      if (row.components.length === 5) {
        rows.push(row);
        row = new ActionRowBuilder<ButtonBuilder>();
      }

      row.addComponents(
        new ButtonBuilder()
          .setLabel(`Tank Ban`)
          .setStyle(ButtonStyle.Danger)
          .setCustomId(`${channelId}-${TANK_BAN_NAME}-${stepAction}`),
      );
    }

    rows.push(row);
  }

  return rows;
};
