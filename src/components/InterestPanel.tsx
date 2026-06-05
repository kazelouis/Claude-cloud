"use client";

import { useState, useTransition } from "react";
import { respondToRide, withdrawResponse } from "@/app/actions/responses";

export function InterestPanel({
  rideId,
  alreadyResponded,
  existingMessage,
  rideType,
}: {
  rideId: string;
  alreadyResponded: boolean;
  existingMessage: string | null;
  rideType: "OFFER" | "REQUEST";
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(existingMessage ?? "");
  const [pending, startTransition] = useTransition();

  const cta =
    rideType === "OFFER" ? "Request this seat" : "Offer them a ride";

  if (alreadyResponded && !open) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
        <p className="font-semibold text-green-800">
          ✅ You&apos;ve expressed interest
        </p>
        <p className="mt-1 text-sm text-green-700">
          The poster can see your name and email to coordinate. We&apos;ll let
          you work out the details directly.
        </p>
        <div className="mt-3 flex gap-3">
          <button
            onClick={() => setOpen(true)}
            className="text-sm font-medium text-green-800 underline"
          >
            Edit message
          </button>
          <button
            onClick={() =>
              startTransition(() => withdrawResponse(rideId))
            }
            disabled={pending}
            className="text-sm font-medium text-stone-500 underline"
          >
            Withdraw
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-100 bg-card p-4 shadow-sm">
      <p className="font-semibold text-stone-800">Interested?</p>
      <p className="mt-1 text-sm text-stone-500">
        Send a quick note. The poster will see your name and BGC email so you
        can coordinate.
      </p>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder="Hi! I'm near the same area, could we coordinate?"
        className="mt-3 w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 outline-none focus:border-brand"
      />
      <div className="mt-3 flex gap-2">
        <button
          onClick={() =>
            startTransition(async () => {
              await respondToRide(rideId, message);
              setOpen(false);
            })
          }
          disabled={pending}
          className="rounded-xl bg-brand px-4 py-2.5 font-semibold text-white transition hover:bg-amber-700 disabled:opacity-60"
        >
          {pending ? "Sending…" : cta}
        </button>
        {open && (
          <button
            onClick={() => setOpen(false)}
            className="rounded-xl px-4 py-2.5 font-medium text-stone-500"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
