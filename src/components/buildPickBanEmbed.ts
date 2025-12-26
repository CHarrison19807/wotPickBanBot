import type { PickBanState } from "@/models";

export const buildPickBanEmbed = (pickBanState: PickBanState) => {
  const { log, channelId } = pickBanState;

  const description = log.join("\n");
  const embed = {
    title: `Pick/Ban for Match ${channelId}`,
    description,
  };
  return [embed];
};
