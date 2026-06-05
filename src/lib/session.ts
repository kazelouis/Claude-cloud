import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * Returns the current signed-in user, or redirects to the sign-in page.
 * Use at the top of any protected server component or server action.
 */
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin");
  }
  return session.user;
}
