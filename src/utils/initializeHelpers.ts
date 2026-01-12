import type { Collection, GuildMember, Role } from "discord.js";
import type { TeamData } from "../models";
import type { Prisma } from "../prisma/generated";

interface GetTeamCaptainParams {
  teamRoleId: string;
  captainRoleId: string;
  users: Collection<string, GuildMember>;
}

interface GetTeamMembersParams {
  teamRoleId: string;
  users: Collection<string, GuildMember>;
}

interface GetTeamRolesParams {
  teamRolePrefix: string;
  captainRoleId: string;
  roles: Collection<string, Role>;
}
export const getTeamCaptain = (params: GetTeamCaptainParams): GuildMember => {
  const { teamRoleId, captainRoleId, users } = params;

  const teamMembers = users.filter((member) => member.roles.cache.has(teamRoleId));
  const captainCandidates = teamMembers.filter((member) => member.roles.cache.has(captainRoleId));

  if (captainCandidates.size > 1) {
    throw new Error(`Multiple captains found for team role ID: ${teamRoleId}`);
  }

  const teamCaptain = captainCandidates.first();

  if (!teamCaptain) {
    throw new Error(`Captain not found for team role ID: ${teamRoleId}`);
  }

  return teamCaptain;
};

export const getTeamMembers = (params: GetTeamMembersParams): GuildMember[] => {
  const { teamRoleId, users } = params;

  const teamMembers = users.filter((member) => member.roles.cache.has(teamRoleId));

  return Array.from(teamMembers.values());
};

export const getTeamRoles = (params: GetTeamRolesParams): Role[] => {
  const { teamRolePrefix, captainRoleId, roles } = params;

  const teamRoles = roles.filter((role) => role.name.startsWith(teamRolePrefix) && role.id !== captainRoleId);

  return Array.from(teamRoles.values());
};

export const formatTeamData = (data: TeamData): Prisma.TeamCreateInput => {
  return {
    roleId: data.roleId,
    captain: { connect: { discordId: data.captainId } },
    members: {
      connect: data.memberIds.map((id) => ({ discordId: id })),
    },
  };
};
