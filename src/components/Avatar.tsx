import { avatarColor, initials } from "@/lib/format";

export function Avatar({
  name,
  email,
  size = 36,
}: {
  name?: string | null;
  email?: string | null;
  size?: number;
}) {
  const seed = name || email || "?";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${avatarColor(
        seed,
      )}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      title={name || email || undefined}
      aria-hidden
    >
      {initials(name || email)}
    </span>
  );
}
