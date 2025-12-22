import "dotenv/config";
import { prisma } from "@/prisma";

const main = async () => {
  console.log("Seeding database...");

  console.log("Database seeded successfully");
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
