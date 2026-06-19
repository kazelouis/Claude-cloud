import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { FilterBar } from "@/components/FilterBar";
import { RideCard } from "@/components/RideCard";
import {
  RIDE_TYPES,
  DIRECTIONS,
  OFFICES,
  SORT_OPTIONS,
  DEFAULT_SORT,
  type RideType,
  type Direction,
  type SortKey,
} from "@/lib/constants";
import type { Prisma } from "@prisma/client";

const ORDER_BY: Record<SortKey, Prisma.RideOrderByWithRelationInput[]> = {
  soonest: [{ date: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }],
  recent: [{ createdAt: "desc" }],
  office: [
    { office: { sort: "asc", nulls: "last" } },
    { date: { sort: "asc", nulls: "last" } },
  ],
  seats: [{ seats: "desc" }, { createdAt: "desc" }],
};

export const dynamic = "force-dynamic";

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireUser();
  const sp = await searchParams;

  const type = RIDE_TYPES.includes(sp.type as RideType)
    ? (sp.type as RideType)
    : undefined;
  const direction = DIRECTIONS.includes(sp.direction as Direction)
    ? (sp.direction as Direction)
    : undefined;
  const office =
    sp.office && OFFICES.includes(sp.office) ? sp.office : undefined;
  const q = sp.q?.trim();
  const sort: SortKey = SORT_OPTIONS.some((s) => s.value === sp.sort)
    ? (sp.sort as SortKey)
    : DEFAULT_SORT;

  const where: Prisma.RideWhereInput = {
    status: "OPEN",
    ...(type ? { type } : {}),
    ...(direction ? { direction } : {}),
    ...(office ? { office } : {}),
    ...(q ? { area: { contains: q, mode: "insensitive" } } : {}),
  };

  const rides = await prisma.ride.findMany({
    where,
    orderBy: ORDER_BY[sort],
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { responses: true } },
    },
    take: 100,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Ride board</h1>
          <p className="text-sm text-stone-500">
            {rides.length} open {rides.length === 1 ? "ride" : "rides"} right now
          </p>
        </div>
      </div>

      {sp.posted === "1" && (
        <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          🎉 Your ride is posted! Coworkers can now reach out.
        </div>
      )}

      <div className="mt-6">
        <FilterBar />
      </div>

      {rides.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-amber-200 bg-white/60 p-10 text-center">
          <p className="text-4xl" aria-hidden>
            🛣️
          </p>
          <p className="mt-3 font-semibold text-stone-700">No rides match yet</p>
          <p className="mt-1 text-sm text-stone-500">
            Be the first — post an offer or a request to get things rolling.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rides.map((ride) => (
            <RideCard key={ride.id} ride={ride} />
          ))}
        </div>
      )}
    </div>
  );
}
