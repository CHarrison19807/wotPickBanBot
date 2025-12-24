import { createTeam, deleteAllTeams } from "@/prisma/team";
import { createUser, deleteAllUsers } from "@/prisma/user";
import { formatTeamData, getTeamCaptain, getTeamMembers, getTeamRoles } from "@/utils/initializeHelpers";
import { type ChatInputCommandInteraction, type GuildMember, MessageFlags, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("initialiaze_users_and_teams")
  .setDescription("Initializs users and teams from their preexisting roles.")
  .addRoleOption((option) =>
    option
      .setName("captain_role")
      .setDescription("The role that has been assigned to all team captains.")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("team_role_prefix")
      .setDescription("The prefix for all team roles. Ex: `Team` would catch `Team A`, `Team B`, etc.")
      .setRequired(true),
  )
  .addIntegerOption((option) =>
    option
      .setName("number_of_teams")
      .setDescription("The number of teams to initialize.")
      .setRequired(true)
      .setMinValue(1),
  )
  .addIntegerOption((option) =>
    option
      .setName("players_per_team")
      .setDescription("The number of players per team.")
      .setRequired(true)
      .setMinValue(1),
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const captainRoleId = interaction.options.getRole("captain_role", true).id;
  const teamRolePrefix = interaction.options.getString("team_role_prefix", true);
  const numberOfTeams = interaction.options.getInteger("number_of_teams", true);
  const playersPerTeam = interaction.options.getInteger("players_per_team", true);

  const discordGuild = interaction.guild;
  let interactionContent = "";

  if (!discordGuild) {
    await interaction.reply({
      content: "This command can only be used in a server.",
      ephemeral: true,
    });
    return;
  }

  await deleteAllTeams();
  await deleteAllUsers();

  const roles = await discordGuild.roles.fetch();
  const users = await discordGuild.members.fetch();

  const teamRoles = getTeamRoles({ teamRolePrefix, captainRoleId, roles });

  if (teamRoles.length !== numberOfTeams) {
    interactionContent += `Expected to find ${numberOfTeams} team roles with the prefix "${teamRolePrefix}", but found ${teamRoles.length}.`;
  }

  const usersInitializedSet = new Set<string>();

  for (const teamRole of teamRoles) {
    const teamRoleId = teamRole.id;

    const teamMembers = getTeamMembers({ teamRoleId, users });

    if (teamMembers.length !== playersPerTeam) {
      interactionContent += `\nTeam "${teamRole.name}" expected to have ${playersPerTeam} members, but found ${teamMembers.length}.`;
      continue;
    }

    let teamCaptain: GuildMember;

    try {
      teamCaptain = getTeamCaptain({ teamRoleId, captainRoleId, users });
    } catch (error) {
      interactionContent += `\nError finding captain for team "${teamRole.name}": ${(error as Error).message}`;
      continue;
    }

    for (const member of teamMembers) {
      if (usersInitializedSet.has(member.id)) {
        interactionContent += `\nUser "${member.user.tag}" is already initialized as a member of another team.`;
        continue;
      }

      usersInitializedSet.add(member.id);
      await createUser({ discordId: member.id });
      interactionContent += `\nCreated user for member "${member.user.tag}".`;
    }

    const teamData = {
      roleId: teamRoleId,
      captainId: teamCaptain.id,
      memberIds: teamMembers.map((member) => member.id),
    };

    const formattedTeamData = formatTeamData(teamData);

    await createTeam(formattedTeamData);

    interactionContent += `\nCreated team for role "${teamRole.name}" with captain "${teamCaptain.user.tag}".`;
  }

  await interaction.reply({
    content: interactionContent,
    flags: MessageFlags.Ephemeral,
  });
};
