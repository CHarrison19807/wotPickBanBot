import { MAP_POOL, PICK_BAN_CONFIGS } from "../constants";
import type { ExtendedClient, PickBanState } from "../models";
import { getTeam } from "@/prisma/team";
import {
  ChannelType,
  type ChatInputCommandInteraction,
  OverwriteType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { createId } from "@paralleldrive/cuid2";
import { buildPickBanButtons } from "@/components/buildPickBanButtons";
import { buildPickBanEmbed } from "@/components/buildPickBanEmbed";

export const data = new SlashCommandBuilder()
  .setName("initialize_pick_ban")
  .setDescription("Initializes a pick/ban process.")
  .addRoleOption((option) =>
    option.setName("team_a_role").setDescription("The role assigned to Team A.").setRequired(true),
  )
  .addRoleOption((option) =>
    option.setName("team_b_role").setDescription("The role assigned to Team B.").setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("best_of_n")
      .setDescription("The pick/ban configuration to use.")
      .addChoices(
        ...Object.keys(PICK_BAN_CONFIGS).map((key) => ({
          name: key,
          value: key,
        })),
      )
      .setRequired(true),
  )
  .addIntegerOption((option) =>
    option
      .setName("time_per_action")
      .setDescription("The time (in seconds) allocated for each pick/ban action (Min 10 seconds).")
      .setRequired(true)
      .setMinValue(10),
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply();
  const teamARoleId = interaction.options.getRole("team_a_role", true).id;
  const teamBRoleId = interaction.options.getRole("team_b_role", true).id;
  const configKey = interaction.options.getString("best_of_n", true) as keyof typeof PICK_BAN_CONFIGS;
  const timePerAction = interaction.options.getInteger("time_per_action", true);
  const guild = interaction.guild;

  if (!guild) {
    await interaction.editReply({
      content: "This command can only be used in a server.",
    });
    return;
  }

  const user = interaction.user;

  if (!user) {
    await interaction.editReply({
      content: "Unable to identify the user executing the command.",
    });
    return;
  }

  if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator) && user.id !== "615350424156897311") {
    await interaction.editReply({
      content: "You do not have permission to execute this command. Administrator permission is required.",
    });
    return;
  }

  const teamA = await getTeam(teamARoleId);
  const teamB = await getTeam(teamBRoleId);
  const teamACaptainId = teamA ? teamA.captainId : null;
  const teamBCaptainId = teamB ? teamB.captainId : null;

  if (!teamA || !teamB || !teamACaptainId || !teamBCaptainId) {
    await interaction.editReply({
      content:
        "Ensure both teams are initialized and have captains before starting the pick/ban process. Run /initialize first.",
    });
    return;
  }

  let category = guild.channels.cache.find((c) => c.type === ChannelType.GuildCategory && c.name === "Matches");

  if (!category) {
    category = await guild.channels.create({
      name: "Matches",
      type: ChannelType.GuildCategory,
    });
  }

  const matchesCategoryId = category.id;

  const matchId = createId();
  const channel = await guild.channels.create({
    name: `match-${matchId}`,
    type: ChannelType.GuildText,
    parent: matchesCategoryId,
    permissionOverwrites: [
      {
        id: guild.roles.everyone.id,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: teamARoleId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      },
      {
        id: teamBRoleId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      },
      {
        id: teamACaptainId,
        type: OverwriteType.Member,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.UseApplicationCommands,

          PermissionFlagsBits.ReadMessageHistory,
        ],
      },
      {
        id: teamBCaptainId,
        type: OverwriteType.Member,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.UseApplicationCommands,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      },
      {
        id: interaction.client.user.id,
        type: OverwriteType.Member,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      },
    ],
  });

  // TODO - this is a lot, maybe not all necessary
  const newPickBanState: PickBanState = {
    log: [],
    teamACaptainId,
    teamBCaptainId,
    isProcessing: false,
    configKey,
    timePerAction,
    currentStepIndex: 0,
    bannedMaps: [],
    pickedMaps: [],
    availableMaps: [...MAP_POOL],
    channelId: channel.id,
    teamARoleId: teamA.roleId,
    teamBRoleId: teamB.roleId,
    messageId: null,
    timeoutId: null,
  };

  const client = interaction.client as ExtendedClient;
  client.pickBanStates.set(channel.id, newPickBanState);

  channel.send({
    content: `This is the pick/ban channel for match ${matchId} between <@&${teamARoleId}> and <@&${teamBRoleId}>.\n\nAfter the initial action by <@${teamACaptainId}>, each captain will have ${timePerAction} seconds per pick/ban action.\nFailure to act within the time limit will result in a random map being picked/banned.\n\nThis will also serve as the channel to ping when requesting a round reset.\nYou should ping the opposing team captain, the opposing team's role, and an admin.\n\n**<@${teamACaptainId}> ensure that <@${teamBCaptainId}> is ready to begin before making the initial selection.**\n**To ban a tank, type the name of the tank in the channel then click the "Tank Ban" button below.**\n\nGood luck!`,
    embeds: buildPickBanEmbed(newPickBanState),
    components: buildPickBanButtons(newPickBanState),
  });
  await interaction.editReply({
    content: `Match between Team A: <@&${teamARoleId}> and Team B: <@&${teamBRoleId}> pick/ban channel created: ${channel.toString()}`,
  });
};
