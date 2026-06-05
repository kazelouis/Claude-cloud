# 🚗 BGC Carpool

A friendly, community-style web app for **BGC employees** to coordinate
carpools during snow, heavy rain, transit disruptions, and other tough
commute days — making the commute safer, easier, and more connected.

This is the website companion to the BGC Carpool community on Viva Engage.

## What it does

- **Sign in** with your BGC account (restricted to `@bgcengineering.ca`).
- **Post a ride** — either an **Offer** (you're driving, with spare seats) or a
  **Request** (you need a lift). Capture area, direction, date or recurring
  days, arrival/departure times, seats, and cost-share expectations.
- **Browse & filter** the ride board by offers/requests, direction, and area.
- **Express interest** — tap "I'm interested" and the poster sees your name and
  BGC email so you can coordinate directly.
- **Manage your posts** — mark a ride as matched, reopen, cancel, or delete, and
  see who's interested.

## Tech stack

| Layer    | Choice                                                        |
| -------- | ------------------------------------------------------------- |
| Framework| Next.js 16 (App Router) + React 19 + TypeScript               |
| Styling  | Tailwind CSS v4                                               |
| Database | Prisma ORM + SQLite (dev) → Postgres (prod)                   |
| Auth     | Auth.js (NextAuth v5) — Microsoft Entra ID SSO + domain gate  |

## Getting started (local)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
npx auth secret           # writes/updates AUTH_SECRET (or set it manually)

# 3. Create the database and load sample data
npm run db:push
npm run db:seed

# 4. Run it
npm run dev               # http://localhost:3000
```

In development, `ENABLE_DEV_LOGIN="true"` gives you a password-less login —
just enter any `@bgcengineering.ca` email. The seed script creates a few sample
rides so the board isn't empty.

## Sign-in & access control

- Only emails ending in `ALLOWED_EMAIL_DOMAIN` (default `bgcengineering.ca`) can
  sign in — enforced in the Auth.js `signIn` callback.
- **Production** uses **Microsoft Entra ID** (Azure AD) SSO, which fits BGC's
  Microsoft 365 environment. Register an app in
  [Entra](https://entra.microsoft.com), set the three
  `AUTH_MICROSOFT_ENTRA_ID_*` variables, point the issuer at the BGC tenant, and
  set `ENABLE_DEV_LOGIN="false"`.

## Going to production

1. Switch the datasource in `prisma/schema.prisma` to `postgresql` and set a
   Postgres `DATABASE_URL`.
2. Set `AUTH_SECRET`, `AUTH_URL` (your public URL), and the Entra variables.
3. Set `ENABLE_DEV_LOGIN="false"`.
4. Run `npx prisma migrate deploy` (or `db push`) and deploy (e.g. Vercel).

## Project layout

```
prisma/
  schema.prisma      # User, Ride, Response + Auth.js models
  seed.ts            # sample users & rides
src/
  auth.ts            # Auth.js config (Entra SSO + dev login + domain gate)
  lib/               # prisma client, session guard, validation, formatting
  app/
    page.tsx         # landing page
    signin/          # sign-in
    board/           # ride board with filters
    rides/new/       # post a ride
    rides/[id]/      # ride detail, interest, owner controls
    my-rides/        # your posts and the rides you're interested in
    actions/         # server actions (create/update rides, responses)
  components/        # Navbar, RideCard, RideForm, FilterBar, badges, etc.
```

## Disclaimer

Participation is voluntary and arranged between employees directly. BGC is not
responsible for transportation arrangements made through this group.
