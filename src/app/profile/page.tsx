import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { ProfileForm } from "@/components/ProfileForm";
import { Avatar } from "@/components/Avatar";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const sessionUser = await requireUser();
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { name: true, email: true, homeOffice: true, homeArea: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/board" className="text-sm text-stone-500 hover:text-stone-800">
        ← Back to board
      </Link>
      <div className="mt-3 flex items-center gap-3">
        <Avatar name={user?.name} email={user?.email} size={44} />
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Your profile</h1>
          <p className="text-sm text-stone-500">{user?.email}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-stone-500">
        Set your office and home area once — the board will focus on your office
        and new posts will pre-fill, so posting a ride takes seconds.
      </p>
      <div className="mt-6 rounded-3xl border border-amber-100 bg-card p-6 shadow-sm">
        <ProfileForm
          homeOffice={user?.homeOffice ?? null}
          homeArea={user?.homeArea ?? null}
        />
      </div>
    </div>
  );
}
