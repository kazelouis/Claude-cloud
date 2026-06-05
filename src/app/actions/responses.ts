"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

/** Express interest in a ride (or update your message). */
export async function respondToRide(rideId: string, message?: string) {
  const user = await requireUser();

  const ride = await prisma.ride.findUnique({ where: { id: rideId } });
  if (!ride) throw new Error("Ride not found.");
  if (ride.userId === user.id) throw new Error("This is your own post.");

  const trimmed = message?.trim() || null;
  await prisma.response.upsert({
    where: { rideId_userId: { rideId, userId: user.id } },
    update: { message: trimmed },
    create: { rideId, userId: user.id, message: trimmed },
  });

  revalidatePath(`/rides/${rideId}`);
  revalidatePath("/board");
}

/** Withdraw your interest in a ride. */
export async function withdrawResponse(rideId: string) {
  const user = await requireUser();
  await prisma.response.deleteMany({
    where: { rideId, userId: user.id },
  });
  revalidatePath(`/rides/${rideId}`);
  revalidatePath("/board");
}
