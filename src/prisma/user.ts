import { prisma } from "@/prisma";
import type { Prisma } from "./generated";

export const createUser = async (data: Prisma.UserCreateInput) => {
  return prisma.user.create({ data });
};

export const deleteAllUsers = async () => {
  return prisma.user.deleteMany();
};
