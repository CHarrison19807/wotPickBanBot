import { buildPickBanButtons } from "../components/buildPickBanButtons";
import { buildPickBanEmbed } from "../components/buildPickBanEmbed";
import type { ExtendedClient } from "../models";
import type { ButtonInteraction, ChatInputCommandInteraction } from "discord.js";

export const updateInteractionResponse = async (interaction: ButtonInteraction | ChatInputCommandInteraction) => {
  const client = interaction.client as ExtendedClient;
  const channelId = interaction.channelId;
  const pickBanState = client.pickBanStates.get(channelId);
  if (!pickBanState) return;

  const isDeferred = interaction.deferred;
  const isReplied = interaction.replied;
  const isButton = interaction.isButton();

  const embeds = buildPickBanEmbed(pickBanState);
  const components = buildPickBanButtons(pickBanState);

  if (isButton && !isDeferred && !isReplied) {
    return interaction.update({ embeds, components });
  }

  if (isDeferred || isReplied) {
    return interaction.editReply({ embeds, components });
  }

  return interaction.reply({ embeds, components });
};
