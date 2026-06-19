// Build a Microsoft Teams deep link that opens a 1:1 chat with the given
// person (by work email / UPN), optionally pre-filling a message.
// Works for people in the same Microsoft 365 organisation.
export function teamsChatLink(email: string, message?: string): string {
  const params = new URLSearchParams({ users: email });
  if (message) params.set("message", message);
  return `https://teams.microsoft.com/l/chat/0/0?${params.toString()}`;
}

/** First name from a display name, falling back to the email prefix. */
export function firstNameOf(name: string | null, email: string): string {
  const fromName = name?.trim().split(/\s+/)[0];
  return fromName || email.split("@")[0];
}
