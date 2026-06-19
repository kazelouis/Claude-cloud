"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteRide } from "@/app/actions/rides";

// Shown only to admins on posts they don't own.
export function AdminDeleteButton({ rideId }: { rideId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const remove = () => {
    if (!confirm("Delete this post as an admin? This can't be undone.")) return;
    startTransition(async () => {
      await deleteRide(rideId);
      router.push("/board");
    });
  };

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
      <p className="font-semibold text-rose-800">Admin tools</p>
      <p className="mt-1 text-sm text-rose-700">
        You can remove this post as an administrator.
      </p>
      <button
        onClick={remove}
        disabled={pending}
        className="mt-3 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
      >
        {pending ? "Deleting…" : "Delete this post"}
      </button>
    </div>
  );
}
