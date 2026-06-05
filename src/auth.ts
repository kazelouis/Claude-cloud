import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import { prisma } from "@/lib/prisma";

export const ALLOWED_DOMAIN = (
  process.env.ALLOWED_EMAIL_DOMAIN ?? "bgcengineering.ca"
).toLowerCase();

/** True when an email belongs to the allowed organisation domain. */
export function emailAllowed(email?: string | null): boolean {
  if (!email) return false;
  return email.toLowerCase().trim().endsWith(`@${ALLOWED_DOMAIN}`);
}

const devLoginEnabled = process.env.ENABLE_DEV_LOGIN === "true";
const entraConfigured = Boolean(process.env.AUTH_MICROSOFT_ENTRA_ID_ID);

const providers: Provider[] = [];

// Production SSO: Microsoft Entra ID (Azure AD). Only enabled when configured.
if (entraConfigured) {
  providers.push(
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER || undefined,
    }),
  );
}

// Local development: password-less login by email (domain-restricted).
// Never enable in production.
if (devLoginEnabled) {
  providers.push(
    Credentials({
      id: "dev",
      name: "Dev login (email only)",
      credentials: {
        email: { label: "Work email", type: "email" },
        name: { label: "Your name", type: "text" },
      },
      async authorize(creds) {
        const email = String(creds?.email ?? "")
          .toLowerCase()
          .trim();
        if (!emailAllowed(email)) return null;
        const name =
          String(creds?.name ?? "").trim() || email.split("@")[0];
        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: { email, name },
        });
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  );
}

export const providerIds = {
  entra: entraConfigured,
  dev: devLoginEnabled,
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // Self-hosted: trust the deployment host (set AUTH_URL in production).
  trustHost: true,
  session: { strategy: "jwt" },
  providers,
  pages: { signIn: "/signin" },
  callbacks: {
    // Gatekeeper: only BGC employees (allowed domain) may sign in.
    async signIn({ user }) {
      return emailAllowed(user?.email);
    },
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
