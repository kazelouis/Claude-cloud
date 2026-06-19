import Link from "next/link";
import { Avatar } from "./Avatar";
import { Chip, StatusBadge, TypeBadge } from "./Badge";
import { DIRECTION_LABEL, type Direction, type RideType, type Status } from "@/lib/constants";
import {
  formatDays,
  formatRideDate,
  postedAgo,
  exactDateTime,
  isPastRide,
} from "@/lib/format";

// Columns come back from Prisma as plain strings; we narrow at render time.
export type RideCardData = {
  id: string;
  type: string;
  direction: string;
  office: string | null;
  area: string;
  date: Date | null;
  recurring: boolean;
  daysOfWeek: string | null;
  arrivalTime: string | null;
  departureTime: string | null;
  seats: number;
  costShare: string | null;
  status: string;
  user: { name: string | null; email: string };
  createdAt: Date;
  _count?: { responses: number };
};

export function RideCard({ ride }: { ride: RideCardData }) {
  const type = ride.type as RideType;
  const status = ride.status as Status;
  const direction = ride.direction as Direction;
  const when = ride.recurring
    ? formatDays(ride.daysOfWeek)
    : formatRideDate(ride.date);
  const past = isPastRide(ride.date, ride.recurring);
  const dimmed = status !== "OPEN" || past;

  return (
    <Link
      href={`/rides/${ride.id}`}
      className={`group flex h-full flex-col rounded-2xl border border-amber-100 bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md ${
        dimmed ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <TypeBadge type={type} />
          {status !== "OPEN" && <StatusBadge status={status} />}
          {past && status === "OPEN" && (
            <span className="inline-flex items-center rounded-full bg-stone-200 px-2.5 py-1 text-xs font-semibold text-stone-600">
              Past
            </span>
          )}
        </div>
        <span className="text-xs font-medium text-stone-400">
          {DIRECTION_LABEL[direction]}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-stone-800 group-hover:text-brand-ink">
        {ride.area}
      </h3>
      {ride.office && (
        <p className="mt-1 text-sm font-medium text-brand-ink">
          📍 {ride.office}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {when && <Chip>📅 {when}</Chip>}
        {ride.arrivalTime && <Chip>🏢 Arrive {ride.arrivalTime}</Chip>}
        {ride.departureTime && <Chip>🏁 Leave {ride.departureTime}</Chip>}
        <Chip>
          {type === "OFFER" ? "🪑" : "👥"} {ride.seats}{" "}
          {type === "OFFER" ? "seat" : "needed"}
          {ride.seats > 1 && type === "OFFER" ? "s" : ""}
        </Chip>
        {ride.costShare && <Chip>💸 {ride.costShare}</Chip>}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-amber-50 pt-3">
        <div className="flex items-center gap-2">
          <Avatar name={ride.user.name} email={ride.user.email} size={28} />
          <div className="leading-tight">
            <span className="block text-sm text-stone-600">
              {ride.user.name ?? ride.user.email.split("@")[0]}
            </span>
            <span
              className="block text-xs text-stone-400"
              title={exactDateTime(ride.createdAt)}
            >
              Posted {postedAgo(ride.createdAt)}
            </span>
          </div>
        </div>
        {ride._count && ride._count.responses > 0 && (
          <span className="text-xs font-medium text-stone-500">
            {ride._count.responses} interested
          </span>
        )}
      </div>
    </Link>
  );
}
