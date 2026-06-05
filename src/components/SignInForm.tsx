"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export function SignInForm({
  entraEnabled,
  devEnabled,
  allowedDomain,
}: {
  entraEnabled: boolean;
  devEnabled: boolean;
  allowedDomain: string;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleDevSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.toLowerCase().trim().endsWith(`@${allowedDomain}`)) {
      setError(`Please use your @${allowedDomain} email address.`);
      return;
    }
    setLoading(true);
    const res = await signIn("dev", {
      email,
      name,
      redirect: false,
      callbackUrl: "/board",
    });
    setLoading(false);
    if (res?.error) {
      setError("Sign-in failed. Check your email domain and try again.");
    } else if (res?.url) {
      window.location.href = res.url;
    }
  }

  return (
    <div className="space-y-5">
      {entraEnabled && (
        <button
          onClick={() => signIn("microsoft-entra-id", { callbackUrl: "/board" })}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-3 font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50"
        >
          <MicrosoftLogo />
          Continue with Microsoft
        </button>
      )}

      {entraEnabled && devEnabled && (
        <div className="flex items-center gap-3 text-xs text-stone-400">
          <span className="h-px flex-1 bg-stone-200" />
          or
          <span className="h-px flex-1 bg-stone-200" />
        </div>
      )}

      {devEnabled && (
        <form onSubmit={handleDevSignIn} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-stone-700">
              Work email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`you@${allowedDomain}`}
              className="mt-1 w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jordan Smith"
              className="mt-1 w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 outline-none focus:border-brand"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Continue"}
          </button>
          <p className="text-xs text-stone-400">
            Development sign-in (no password). In production, sign in with
            Microsoft.
          </p>
        </form>
      )}

      {!entraEnabled && !devEnabled && (
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          No sign-in method is configured. Set up Microsoft Entra ID or enable
          the development login in your environment variables.
        </p>
      )}

      {error && (
        <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>
      )}
    </div>
  );
}

function MicrosoftLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 23 23" aria-hidden>
      <rect x="1" y="1" width="10" height="10" fill="#f25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7fba00" />
      <rect x="1" y="12" width="10" height="10" fill="#00a4ef" />
      <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
    </svg>
  );
}
