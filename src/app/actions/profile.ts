"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { OFFICES } from "@/lib/constants";

export type ProfileFormState = {
  error?: string;
  saved?: boolean;
};

const profileSchema = z.object({
  homeOffice: z
    .string()
    .trim()
    .refine((v) => v === "" || OFFICES.includes(v), "Pick a valid office")
    .optional(),
  homeArea: z.string().trim().max(120).optional(),
});

export async function updateProfile(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse({
    homeOffice: formData.get("homeOffice") ?? "",
    homeArea: formData.get("homeArea") ?? "",
  });

  if (!parsed.success) {
    return { error: "Please fix the highlighted fields." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      homeOffice: parsed.data.homeOffice || null,
      homeArea: parsed.data.homeArea || null,
    },
  });

  revalidatePath("/board");
  revalidatePath("/rides/new");
  revalidatePath("/profile");
  redirect("/board?saved=1");
}
