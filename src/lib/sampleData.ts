import type { PrismaClient } from "@prisma/client";

// Sample rides used both by the seed script (prisma/seed.ts) and the
// one-click seeding route (/api/admin/seed). Kept self-contained (type-only
// Prisma import) so it can be imported from either place.

export type RideSeed = {
  name: string;
  type: "OFFER" | "REQUEST";
  office: string;
  area: string;
  destination: string;
  direction: "TO_WORK" | "FROM_WORK" | "ROUND_TRIP";
  recurring?: boolean;
  daysOfWeek?: string;
  dayOffset?: number; // days from today for one-off rides
  arrivalTime?: string;
  departureTime?: string;
  seats: number;
  costShare?: string;
  notes?: string;
};

export const SAMPLE_RIDES: RideSeed[] = [
  {
    name: "Aiden Brooks",
    type: "OFFER",
    office: "Calgary, AB",
    area: "Calgary — Beltline",
    destination: "Calgary — Downtown",
    direction: "TO_WORK",
    recurring: true,
    daysOfWeek: "MON,TUE,WED,THU,FRI",
    arrivalTime: "08:30",
    seats: 3,
    costShare: "Split downtown parking",
    notes: "Winter tires on — comfortable driving in the snow.",
  },
  {
    name: "Sofia Martinez",
    type: "REQUEST",
    office: "Toronto, ON",
    area: "Toronto — The Annex",
    destination: "Toronto — Financial District",
    direction: "ROUND_TRIP",
    dayOffset: 1,
    arrivalTime: "09:00",
    departureTime: "17:00",
    seats: 1,
    costShare: "Happy to share gas",
    notes: "Subway line is down tomorrow — would love a lift.",
  },
  {
    name: "Liam O'Connor",
    type: "OFFER",
    office: "Vancouver, BC",
    area: "Burnaby — Brentwood",
    destination: "Coquitlam — Town Centre",
    direction: "FROM_WORK",
    dayOffset: 1,
    departureTime: "16:30",
    seats: 2,
    notes: "Heading east, can drop anywhere along Lougheed Hwy.",
  },
  {
    name: "Priya Sharma",
    type: "REQUEST",
    office: "Edmonton, AB",
    area: "Edmonton — Strathcona (Whyte Ave)",
    destination: "Edmonton — Downtown",
    direction: "TO_WORK",
    recurring: true,
    daysOfWeek: "MON,WED,FRI",
    arrivalTime: "08:00",
    seats: 1,
    notes: "Flexible on the exact pickup spot.",
  },
  {
    name: "Noah Tremblay",
    type: "OFFER",
    office: "Ottawa, ON",
    area: "Ottawa — Westboro",
    destination: "Ottawa — Kanata",
    direction: "ROUND_TRIP",
    dayOffset: 2,
    arrivalTime: "08:45",
    departureTime: "17:15",
    seats: 2,
    costShare: "Gas money appreciated",
    notes: "Parking pass covers a second car — easy carpool.",
  },
  {
    name: "Emma Chen",
    type: "REQUEST",
    office: "Victoria, BC",
    area: "Victoria — Fernwood",
    destination: "Victoria — Downtown",
    direction: "TO_WORK",
    dayOffset: 3,
    arrivalTime: "08:15",
    seats: 1,
    notes: "New to the area — happy to meet at a main intersection.",
  },
  {
    name: "Oliver Schmidt",
    type: "OFFER",
    office: "London, UK",
    area: "London — Clapham",
    destination: "London — The City",
    direction: "TO_WORK",
    recurring: true,
    daysOfWeek: "TUE,THU",
    arrivalTime: "09:00",
    seats: 3,
    costShare: "No charge — company's on the way",
    notes: "Electric car, quiet and warm ride.",
  },
  {
    name: "Maya Patel",
    type: "REQUEST",
    office: "Brisbane, AU",
    area: "Brisbane — Fortitude Valley",
    destination: "Brisbane — South Bank",
    direction: "FROM_WORK",
    dayOffset: 2,
    departureTime: "17:30",
    seats: 1,
    costShare: "Will chip in for petrol",
    notes: "Trains are unreliable this week.",
  },
];

function dateFromOffset(offset: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setHours(0, 0, 0, 0);
  return d;
}

function emailFor(name: string, domain: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z]+/g, ".")
    .replace(/^\.|\.$/g, "");
  return `${slug}@${domain}`;
}

/**
 * Idempotently create the sample users and their rides. Re-running replaces
 * the sample rides (it only touches the sample users, never real posts).
 */
export async function seedSampleRides(
  prisma: PrismaClient,
  domain = "bgcengineering.ca",
): Promise<{ users: number; rides: number }> {
  const users = await Promise.all(
    SAMPLE_RIDES.map((r) => {
      const email = emailFor(r.name, domain);
      return prisma.user.upsert({
        where: { email },
        update: { name: r.name },
        create: { name: r.name, email },
      });
    }),
  );

  await prisma.ride.deleteMany({
    where: { userId: { in: users.map((u) => u.id) } },
  });

  await prisma.ride.createMany({
    data: SAMPLE_RIDES.map((r, i) => ({
      type: r.type,
      direction: r.direction,
      office: r.office,
      area: r.area,
      destination: r.destination,
      recurring: Boolean(r.recurring),
      date:
        r.recurring || r.dayOffset === undefined
          ? null
          : dateFromOffset(r.dayOffset),
      daysOfWeek: r.recurring ? (r.daysOfWeek ?? null) : null,
      arrivalTime: r.arrivalTime ?? null,
      departureTime: r.departureTime ?? null,
      seats: r.seats,
      costShare: r.costShare ?? null,
      notes: r.notes ?? null,
      userId: users[i].id,
    })),
  });

  return { users: users.length, rides: SAMPLE_RIDES.length };
}
