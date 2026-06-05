import type { RideType, Status } from "@/lib/constants";

export function TypeBadge({ type }: { type: RideType }) {
  const isOffer = type === "OFFER";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isOffer
          ? "bg-teal-100 text-teal-800"
          : "bg-violet-100 text-violet-800"
      }`}
    >
      <span aria-hidden>{isOffer ? "🪑" : "🙋"}</span>
      {isOffer ? "Offering" : "Looking"}
    </span>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  if (status === "OPEN") {
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
        Open
      </span>
    );
  }
  if (status === "FULFILLED") {
    return (
      <span className="inline-flex items-center rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-800">
        Matched
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-stone-200 px-2.5 py-1 text-xs font-semibold text-stone-600">
      Cancelled
    </span>
  );
}

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900">
      {children}
    </span>
  );
}
