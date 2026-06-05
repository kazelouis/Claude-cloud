import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, providerIds, ALLOWED_DOMAIN } from "@/auth";
import { SignInForm } from "@/components/SignInForm";

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) redirect("/board");

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
      <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-brand-ink">
        <span aria-hidden>🚗</span> BGC Carpool
      </Link>
      <div className="mt-8 w-full rounded-3xl border border-amber-100 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-stone-800">Welcome back</h1>
        <p className="mt-1 text-sm text-stone-500">
          Sign in with your BGC employee account to offer and find rides.
        </p>
        <div className="mt-6">
          <SignInForm
            entraEnabled={providerIds.entra}
            devEnabled={providerIds.dev}
            allowedDomain={ALLOWED_DOMAIN}
          />
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-stone-400">
        Access is restricted to @{ALLOWED_DOMAIN} email addresses.
      </p>
    </div>
  );
}
