import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { Avatar } from "@/components/Avatar";
import { Chip, StatusBadge, TypeBadge } from "@/components/Badge";
import { InterestPanel } from "@/components/InterestPanel";
import { OwnerControls } from "@/components/OwnerControls";
import {
  DIRECTION_LABEL,
  type Direction,
  type RideType,
  type Status,
} from "@/lib/constants";
import { formatDays, formatRideDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function RideDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const ride = await prisma.ride.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      responses: {
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!ride) notFound();

  const isOwner = ride.user.id === user.id;
  const myResponse = ride.responses.find((r) => r.user.email === user.email);
  const when = ride.recurring
    ? formatDays(ride.daysOfWeek)
    : formatRideDate(ride.date);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/board" className="text-sm text-stone-500 hover:text-stone-800">
        ← Back to board
      </Link>

      <div className="mt-3 rounded-3xl border border-amber-100 bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TypeBadge type={ride.type as RideType} />
            <StatusBadge status={ride.status as Status} />
          </div>
          <span className="text-sm font-medium text-stone-400">
            {DIRECTION_LABEL[ride.direction as Direction]}
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-bold text-stone-800">{ride.area}</h1>
        {ride.office && (
          <p className="mt-1 font-medium text-brand-ink">📍 {ride.office}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {when && <Chip>📅 {when}</Chip>}
          {ride.arrivalTime && <Chip>🏢 Arrive {ride.arrivalTime}</Chip>}
          {ride.departureTime && <Chip>🏁 Leave {ride.departureTime}</Chip>}
          <Chip>
            {ride.type === "OFFER" ? "🪑" : "👥"} {ride.seats}{" "}
            {ride.type === "OFFER" ? "seat(s) available" : "seat(s) needed"}
          </Chip>
        </div>

        {ride.costShare && (
          <p className="mt-4 text-sm text-stone-700">
            <span className="font-semibold">💸 Cost share:</span>{" "}
            {ride.costShare}
          </p>
        )}
        {ride.notes && (
          <p className="mt-3 whitespace-pre-wrap text-stone-700">{ride.notes}</p>
        )}

        <div className="mt-6 flex items-center gap-3 border-t border-amber-50 pt-4">
          <Avatar name={ride.user.name} email={ride.user.email} size={40} />
          <div>
            <p className="font-semibold text-stone-800">
              {ride.user.name ?? ride.user.email.split("@")[0]}
            </p>
            <p className="text-sm text-stone-500">
              Posted by {isOwner ? "you" : "a coworker"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {isOwner ? (
          <div className="space-y-6">
            <OwnerControls rideId={ride.id} status={ride.status as Status} />

            <div>
              <h2 className="font-bold text-stone-800">
                Interested coworkers ({ride.responses.length})
              </h2>
              {ride.responses.length === 0 ? (
                <p className="mt-2 text-sm text-stone-500">
                  No one has responded yet. Share the board with your team!
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {ride.responses.map((r) => (
                    <li
                      key={r.id}
                      className="rounded-2xl border border-amber-100 bg-card p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={r.user.name}
                          email={r.user.email}
                          size={36}
                        />
                        <div>
                          <p className="font-semibold text-stone-800">
                            {r.user.name ?? r.user.email.split("@")[0]}
                          </p>
                          <a
                            href={`mailto:${r.user.email}`}
                            className="text-sm text-brand hover:underline"
                          >
                            {r.user.email}
                          </a>
                        </div>
                      </div>
                      {r.message && (
                        <p className="mt-2 text-sm text-stone-600">
                          “{r.message}”
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : ride.status === "OPEN" ? (
          <InterestPanel
            rideId={ride.id}
            alreadyResponded={!!myResponse}
            existingMessage={myResponse?.message ?? null}
            rideType={ride.type as RideType}
          />
        ) : (
          <p className="rounded-2xl border border-amber-100 bg-card p-4 text-sm text-stone-500 shadow-sm">
            This ride is {ride.status === "FULFILLED" ? "matched" : "cancelled"}{" "}
            and no longer accepting responses.
          </p>
        )}
      </div>
    </div>
  );
}
