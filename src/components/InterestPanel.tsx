"use client";

import { useTransition } from "react";
import { respondToRide, withdrawResponse } from "@/app/actions/responses";
import { TeamsButton } from "./TeamsButton";
import { CopyButton } from "./CopyButton";
import { firstNameOf } from "@/lib/teams";

export function InterestPanel({
  rideId,
  posterName,
  posterEmail,
  area,
  office,
  rideType,
  alreadyResponded,
}: {
  rideId: string;
  posterName: string | null;
  posterEmail: string;
  area: string;
  office: string | null;
  rideType: "OFFER" | "REQUEST";
  alreadyResponded: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const firstName = firstNameOf(posterName, posterEmail);
  const kind = rideType === "OFFER" ? "ride offer" : "ride request";
  const place = office ? `${area} (${office})` : area;
  const message = `Hi ${firstName}, I saw your BGC Carpool ${kind} for ${place} — could we coordinate a carpool?`;

  // Reaching out on Teams also records interest so the poster sees you.
  const registerInterest = () => startTransition(() => respondToRide(rideId));

  return (
    <div className="rounded-2xl border border-amber-100 bg-card p-4 shadow-sm">
      <p className="font-semibold text-stone-800">Interested? Connect on Teams</p>
      <p className="mt-1 text-sm text-stone-500">
        Message {firstName} on Microsoft Teams to sort out pickup and timing.
        {alreadyResponded
          ? " They can see that you're interested."
          : " Tapping the button also lets them know you're interested."}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <TeamsButton
          email={posterEmail}
          message={message}
          onOpen={registerInterest}
          label={`Message ${firstName} on Teams`}
        />
        <CopyButton value={posterName ?? posterEmail} label="Copy name" />
        <CopyButton value={posterEmail} label="Copy email" />
      </div>

      {alreadyResponded && (
        <p className="mt-3 text-sm text-green-700">
          ✅ You&apos;re on the interested list.
          <button
            onClick={() => startTransition(() => withdrawResponse(rideId))}
            disabled={pending}
            className="ml-2 text-stone-500 underline hover:text-stone-700"
          >
            Remove me
          </button>
        </p>
      )}
    </div>
  );
}
