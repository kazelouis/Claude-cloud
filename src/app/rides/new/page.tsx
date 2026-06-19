import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { RideForm } from "@/components/RideForm";
import { createRide } from "@/app/actions/rides";

export const dynamic = "force-dynamic";

export default async function NewRidePage() {
  const sessionUser = await requireUser();
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { homeOffice: true, homeArea: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/board" className="text-sm text-stone-500 hover:text-stone-800">
        ← Back to board
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-stone-800">Post a ride</h1>
      <p className="text-sm text-stone-500">
        Offer your spare seats or ask for a lift. Coworkers will see your post
        on the board.
      </p>
      <div className="mt-6 rounded-3xl border border-amber-100 bg-card p-6 shadow-sm">
        <RideForm
          action={createRide}
          submitLabel="Post ride"
          defaults={{
            office: user?.homeOffice ?? undefined,
            area: user?.homeArea ?? undefined,
          }}
        />
      </div>
    </div>
  );
}
