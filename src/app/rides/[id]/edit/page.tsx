import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { RideForm, type RideDefaults } from "@/components/RideForm";
import { updateRide } from "@/app/actions/rides";
import type { RideType } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function EditRidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const ride = await prisma.ride.findUnique({ where: { id } });
  if (!ride) notFound();
  // Only the author may edit their own post.
  if (ride.userId !== user.id) redirect(`/rides/${id}`);

  const defaults: RideDefaults = {
    type: ride.type as RideType,
    direction: ride.direction,
    office: ride.office ?? "",
    area: ride.area,
    destination: ride.destination ?? undefined,
    recurring: ride.recurring,
    date: ride.date ? ride.date.toISOString().slice(0, 10) : undefined,
    daysOfWeek: ride.daysOfWeek ? ride.daysOfWeek.split(",") : [],
    arrivalTime: ride.arrivalTime ?? undefined,
    departureTime: ride.departureTime ?? undefined,
    seats: ride.seats,
    costShare: ride.costShare ?? undefined,
    notes: ride.notes ?? undefined,
  };

  const action = updateRide.bind(null, ride.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href={`/rides/${ride.id}`}
        className="text-sm text-stone-500 hover:text-stone-800"
      >
        ← Back to ride
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-stone-800">Edit ride</h1>
      <p className="text-sm text-stone-500">
        Update the details — changes are visible on the board right away.
      </p>
      <div className="mt-6 rounded-3xl border border-amber-100 bg-card p-6 shadow-sm">
        <RideForm action={action} defaults={defaults} submitLabel="Save changes" />
      </div>
    </div>
  );
}
