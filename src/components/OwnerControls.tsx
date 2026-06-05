"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteRide, setRideStatus } from "@/app/actions/rides";
import type { Status } from "@/lib/constants";

export function OwnerControls({
  rideId,
  status,
}: {
  rideId: string;
  status: Status;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const update = (next: Status) =>
    startTransition(() => setRideStatus(rideId, next));

  const remove = () => {
    if (!confirm("Delete this ride post? This can't be undone.")) return;
    startTransition(async () => {
      await deleteRide(rideId);
      router.push("/my-rides");
    });
  };

  return (
    <div className="rounded-2xl border border-amber-100 bg-card p-4 shadow-sm">
      <p className="font-semibold text-stone-800">Manage your post</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {status !== "FULFILLED" && (
          <button
            onClick={() => update("FULFILLED")}
            disabled={pending}
            className="rounded-xl bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-200 disabled:opacity-60"
          >
            Mark as matched
          </button>
        )}
        {status !== "OPEN" && (
          <button
            onClick={() => update("OPEN")}
            disabled={pending}
            className="rounded-xl bg-green-100 px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-200 disabled:opacity-60"
          >
            Reopen
          </button>
        )}
        {status !== "CANCELLED" && (
          <button
            onClick={() => update("CANCELLED")}
            disabled={pending}
            className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-200 disabled:opacity-60"
          >
            Cancel ride
          </button>
        )}
        <button
          onClick={remove}
          disabled={pending}
          className="rounded-xl px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-60"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
