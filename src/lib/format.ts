import { format, formatDistanceToNow, isToday, isTomorrow } from "date-fns";
import { WEEKDAY_LABEL, type Weekday } from "./constants";

/** Relative "posted" label, e.g. "about 2 hours ago", "3 days ago". */
export function postedAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

/** Full timestamp for tooltips, e.g. "Jun 19, 2026, 2:30 PM". */
export function exactDateTime(date: Date): string {
  return format(date, "PPpp");
}

/** Friendly date label, e.g. "Today", "Tomorrow", or "Mon, Jun 8". */
export function formatRideDate(date: Date | null): string {
  if (!date) return "";
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "EEE, MMM d");
}

/** Turn "MON,WED,FRI" into "Mon · Wed · Fri". */
export function formatDays(csv: string | null): string {
  if (!csv) return "";
  return csv
    .split(",")
    .map((d) => WEEKDAY_LABEL[d as Weekday] ?? d)
    .join(" · ");
}

/** Initials for a name/email, used in avatars. */
export function initials(nameOrEmail?: string | null): string {
  if (!nameOrEmail) return "?";
  const base = nameOrEmail.includes("@")
    ? nameOrEmail.split("@")[0].replace(/[._-]/g, " ")
    : nameOrEmail;
  const parts = base.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Deterministic warm background colour for an avatar based on a string. */
export function avatarColor(seed?: string | null): string {
  const palette = [
    "bg-amber-200 text-amber-900",
    "bg-rose-200 text-rose-900",
    "bg-teal-200 text-teal-900",
    "bg-sky-200 text-sky-900",
    "bg-violet-200 text-violet-900",
    "bg-lime-200 text-lime-900",
    "bg-orange-200 text-orange-900",
  ];
  let hash = 0;
  for (const ch of seed ?? "") hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return palette[hash % palette.length];
}
