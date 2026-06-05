import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const domain = process.env.ALLOWED_EMAIL_DOMAIN ?? "bgcengineering.ca";

  const people = [
    { name: "Priya Anand", email: `priya.anand@${domain}` },
    { name: "Marcus Lee", email: `marcus.lee@${domain}` },
    { name: "Dana Whitecloud", email: `dana.whitecloud@${domain}` },
    { name: "Tom Becker", email: `tom.becker@${domain}` },
  ];

  const users = await Promise.all(
    people.map((p) =>
      prisma.user.upsert({
        where: { email: p.email },
        update: { name: p.name },
        create: p,
      }),
    ),
  );

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  // Clear sample rides so re-seeding stays idempotent.
  await prisma.ride.deleteMany({
    where: { userId: { in: users.map((u) => u.id) } },
  });

  await prisma.ride.createMany({
    data: [
      {
        type: "OFFER",
        direction: "TO_WORK",
        area: "North Vancouver — Lonsdale",
        recurring: true,
        daysOfWeek: "MON,TUE,WED,THU,FRI",
        arrivalTime: "08:30",
        seats: 3,
        costShare: "Happy to split parking",
        notes: "Snow-ready AWD. Can pick up near Lonsdale Quay.",
        userId: users[0].id,
      },
      {
        type: "REQUEST",
        direction: "ROUND_TRIP",
        area: "Burnaby — Metrotown",
        date: tomorrow,
        arrivalTime: "09:00",
        departureTime: "17:00",
        seats: 1,
        costShare: "Will chip in for gas",
        notes: "Transit is unreliable tomorrow with the forecast.",
        userId: users[1].id,
      },
      {
        type: "OFFER",
        direction: "FROM_WORK",
        area: "Downtown → Tri-Cities",
        date: tomorrow,
        departureTime: "16:30",
        seats: 2,
        notes: "Heading toward Coquitlam, can drop along the way.",
        userId: users[2].id,
      },
      {
        type: "REQUEST",
        direction: "TO_WORK",
        area: "Surrey — Guildford",
        recurring: true,
        daysOfWeek: "MON,WED,FRI",
        arrivalTime: "08:00",
        seats: 1,
        notes: "Flexible on exact pickup spot.",
        userId: users[3].id,
      },
    ],
  });

  console.log(`Seeded ${users.length} users and sample rides.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
