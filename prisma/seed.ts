import { PrismaClient } from "@prisma/client";
import { seedSampleRides } from "../src/lib/sampleData";

const prisma = new PrismaClient();

seedSampleRides(prisma, process.env.ALLOWED_EMAIL_DOMAIN ?? "bgcengineering.ca")
  .then(({ users, rides }) => {
    console.log(`Seeded ${users} users and ${rides} sample rides.`);
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
