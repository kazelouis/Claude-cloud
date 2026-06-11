"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { rideSchema } from "@/lib/validation";
import type { Status } from "@/lib/constants";

export type RideFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

function parseForm(formData: FormData) {
  return rideSchema.safeParse({
    type: formData.get("type"),
    direction: formData.get("direction"),
    office: formData.get("office"),
    area: formData.get("area"),
    recurring: formData.get("recurring") === "on",
    date: formData.get("date") ?? undefined,
    daysOfWeek: formData.getAll("daysOfWeek"),
    arrivalTime: formData.get("arrivalTime") ?? undefined,
    departureTime: formData.get("departureTime") ?? undefined,
    seats: formData.get("seats") ?? 1,
    costShare: formData.get("costShare") ?? undefined,
    notes: formData.get("notes") ?? undefined,
  });
}

export async function createRide(
  _prev: RideFormState,
  formData: FormData,
): Promise<RideFormState> {
  const user = await requireUser();
  const parsed = parseForm(formData);

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const d = parsed.data;
  await prisma.ride.create({
    data: {
      type: d.type,
      direction: d.direction,
      office: d.office,
      area: d.area,
      recurring: d.recurring,
      date: d.recurring || !d.date ? null : new Date(d.date),
      daysOfWeek: d.recurring ? d.daysOfWeek.join(",") : null,
      arrivalTime: d.arrivalTime ?? null,
      departureTime: d.departureTime ?? null,
      seats: d.seats,
      costShare: d.costShare ?? null,
      notes: d.notes ?? null,
      userId: user.id,
    },
  });

  revalidatePath("/board");
  revalidatePath("/my-rides");
  redirect("/board?posted=1");
}

async function ownRideOrThrow(rideId: string, userId: string) {
  const ride = await prisma.ride.findUnique({ where: { id: rideId } });
  if (!ride || ride.userId !== userId) {
    throw new Error("Ride not found or not yours.");
  }
  return ride;
}

export async function setRideStatus(rideId: string, status: Status) {
  const user = await requireUser();
  await ownRideOrThrow(rideId, user.id);
  await prisma.ride.update({ where: { id: rideId }, data: { status } });
  revalidatePath("/board");
  revalidatePath("/my-rides");
  revalidatePath(`/rides/${rideId}`);
}

export async function deleteRide(rideId: string) {
  const user = await requireUser();
  await ownRideOrThrow(rideId, user.id);
  await prisma.ride.delete({ where: { id: rideId } });
  revalidatePath("/board");
  revalidatePath("/my-rides");
}
