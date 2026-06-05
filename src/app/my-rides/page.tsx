import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { RideCard } from "@/components/RideCard";

export const dynamic = "force-dynamic";

export default async function MyRidesPage() {
  const user = await requireUser();

  const [posted, responses] = await Promise.all([
    prisma.ride.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { responses: true } },
      },
    }),
    prisma.response.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        ride: {
          include: {
            user: { select: { name: true, email: true } },
            _count: { select: { responses: true } },
          },
        },
      },
    }),
  ]);

  const interested = responses.map((r) => r.ride);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-800">My rides</h1>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-stone-700">Posts you created</h2>
          <Link href="/rides/new" className="text-sm font-semibold text-brand hover:underline">
            + Post a ride
          </Link>
        </div>
        {posted.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">
            You haven&apos;t posted any rides yet.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posted.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-bold text-stone-700">Rides you&apos;re interested in</h2>
        {interested.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">
            Browse the{" "}
            <Link href="/board" className="text-brand hover:underline">
              ride board
            </Link>{" "}
            and tap “I&apos;m interested” to coordinate.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {interested.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
