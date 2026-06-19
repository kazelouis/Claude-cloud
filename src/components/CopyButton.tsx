"use client";

import { useState } from "react";

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // Clipboard may be unavailable; ignore.
        }
      }}
      className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
    >
      {copied ? "✓ Copied" : label}
    </button>
  );
}
