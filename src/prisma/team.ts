import { prisma } from "./";
import type { Prisma } from "./generated";

export const createTeam = async (data: Prisma.TeamCreateInput) => {
  return prisma.team.create({ data });
};

export const deleteAllTeams = async () => {
  return prisma.team.deleteMany();
};

export const getTeam = async (roleId: string) => {
  return prisma.team.findUnique({ where: { roleId }, include: { members: true } });
};

export const getAllTeams = async () => {
  return prisma.team.findMany({ include: { members: true } });
};
