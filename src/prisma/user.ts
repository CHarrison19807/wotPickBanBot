import { prisma } from "./";
import type { Prisma } from "./generated";

export const createUser = async (data: Prisma.UserCreateInput) => {
  return prisma.user.create({ data });
};

export const deleteAllUsers = async () => {
  return prisma.user.deleteMany();
};

export const getAllUsers = async () => {
  return prisma.user.findMany();
};