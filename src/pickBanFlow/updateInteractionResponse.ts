import { buildPickBanButtons } from "@/components/buildPickBanButtons";
import { buildPickBanEmbed } from "@/components/buildPickBanEmbed";
import type { ExtendedClient } from "@/models";
import type { ButtonInteraction } from "discord.js";

export const updateInteractionResponse = async (interaction: ButtonInteraction) => {
  const client = interaction.client as ExtendedClient;
  const channelId = interaction.channelId;
  const pickBanState = client.pickBanStates.get(channelId);

  if (!pickBanState) return;
  try {
    await interaction.update({
      embeds: buildPickBanEmbed(pickBanState),
      components: buildPickBanButtons(pickBanState),
    });
  } catch {
    if (interaction.deferred || interaction.replied) {
      const message = await interaction.fetchReply();
      await message.edit({
        embeds: buildPickBanEmbed(pickBanState),
        components: buildPickBanButtons(pickBanState),
      });
    }
  }
};
