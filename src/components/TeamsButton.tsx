"use client";

import { teamsChatLink } from "@/lib/teams";

export function TeamsButton({
  email,
  label,
  message,
  onOpen,
  variant = "primary",
}: {
  email: string;
  label: string;
  message?: string;
  onOpen?: () => void;
  variant?: "primary" | "secondary";
}) {
  const base =
    "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition";
  const styles =
    variant === "primary"
      ? "bg-[#5059c9] text-white hover:bg-[#444dba]"
      : "border border-[#5059c9]/30 bg-white text-[#444dba] hover:bg-[#5059c9]/10";

  return (
    <a
      href={teamsChatLink(email, message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onOpen}
      className={`${base} ${styles}`}
    >
      <TeamsIcon />
      {label}
    </a>
  );
}

function TeamsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <rect x="2" y="6" width="13" height="12" rx="2.5" fill="#fff" opacity="0.95" />
      <text
        x="8.5"
        y="15.5"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill="#5059c9"
        fontFamily="system-ui, sans-serif"
      >
        T
      </text>
      <circle cx="18.5" cy="9" r="3.4" fill="#fff" opacity="0.95" />
    </svg>
  );
}
