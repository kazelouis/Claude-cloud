// Admin allow-list, configured via the ADMIN_EMAILS environment variable
// (comma-separated work emails). Admins may delete any post; everyone else
// can only manage their own. If unset, there are no admins.
export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}
