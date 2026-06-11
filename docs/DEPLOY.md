# Deploying BGC Carpool to a real web address

This puts the app online at a URL your coworkers can open. The live stack is:

- **Vercel** — hosts the website (free tier, deploys from GitHub)
- **Neon** — the PostgreSQL database (free tier)
- **Microsoft Entra ID** — the BGC-only login (see `MICROSOFT_LOGIN.md`)

You'll do this through web dashboards — almost no command line. Budget ~30 min.

---

## Step 1 — Create the database (Neon)

1. Go to **https://neon.tech** and sign up (you can use your GitHub or Google
   account).
2. Create a new project — name it `bgc-carpool`. Accept the default region
   closest to you.
3. After it's created, find the **Connection string** (Neon shows it on the
   dashboard, often labelled "Connection string" with a **Copy** button). It
   looks like:
   ```
   postgresql://user:password@ep-xxxx.us-west-2.aws.neon.tech/dbname?sslmode=require
   ```
4. **Copy it and keep it handy** — this is your `DATABASE_URL`.

---

## Step 2 — Put the code on GitHub

Your code is already in the GitHub repo `kazelouis/Claude-cloud` on the branch
`claude/pensive-keller-CQrYA`. For the simplest Vercel setup, merge that branch
into `main` (or just deploy the branch directly — Vercel lets you pick a branch).

> If you're comfortable: open a Pull Request from the branch into `main` on
> GitHub and merge it. Otherwise you can point Vercel straight at the branch in
> Step 3.

---

## Step 3 — Deploy on Vercel

1. Go to **https://vercel.com** and sign up **with your GitHub account**.
2. Click **Add New… → Project**, then **Import** the `Claude-cloud` repository.
   - If asked, install the Vercel GitHub app and grant access to the repo.
3. Vercel auto-detects Next.js — leave the build settings as they are.
4. **Before clicking Deploy**, expand **Environment Variables** and add these
   (Name → Value):

   | Name | Value |
   | --- | --- |
   | `DATABASE_URL` | the Neon connection string from Step 1 |
   | `AUTH_SECRET` | a long random string — generate one at https://generate-secret.vercel.app/32 |
   | `ALLOWED_EMAIL_DOMAIN` | `bgcengineering.ca` |
   | `ENABLE_DEV_LOGIN` | `false` |
   | `AUTH_MICROSOFT_ENTRA_ID_ID` | from `MICROSOFT_LOGIN.md` Part A |
   | `AUTH_MICROSOFT_ENTRA_ID_SECRET` | from `MICROSOFT_LOGIN.md` Part A |
   | `AUTH_MICROSOFT_ENTRA_ID_ISSUER` | `https://login.microsoftonline.com/<tenant-id>/v2.0` |

5. Click **Deploy**. Vercel will install, create the database tables
   automatically (via `prisma migrate deploy` in the build), and build the site.
6. When it finishes you'll get a URL like **`https://claude-cloud-xxxx.vercel.app`**.

---

## Step 4 — Point Microsoft at your live URL

Microsoft only allows sign-in redirects to URLs you've registered. Now that you
have a Vercel URL:

1. Go back to your app in **https://entra.microsoft.com → App registrations →
   BGC Carpool → Authentication**.
2. Under **Web → Redirect URIs**, add:
   ```
   https://YOUR-VERCEL-URL/api/auth/callback/microsoft-entra-id
   ```
   (Replace `YOUR-VERCEL-URL` with your real Vercel domain.)
3. Save.

That's it — open your Vercel URL, click **Continue with Microsoft**, and you're
in. Share the URL with your coworkers.

---

## Optional niceties

- **Custom domain:** In Vercel → your project → **Settings → Domains**, you can
  add something friendlier like `carpool.bgc.com` (needs a domain you control).
  If you do, also add its `/api/auth/callback/microsoft-entra-id` to the
  Microsoft redirect URIs.
- **Separate test database:** Neon supports "branches" if you later want a
  sandbox DB for testing separate from the live data.

---

## Updating the site after launch

Whenever new code is pushed to the branch Vercel is watching, Vercel
**redeploys automatically**. Database schema changes are applied during the
build, so there's nothing manual to run.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Build fails on `migrate deploy` | `DATABASE_URL` is wrong/missing in Vercel env vars, or the Neon string lacks `?sslmode=require`. |
| `redirect_uri mismatch` after clicking Microsoft | The Vercel URL in Step 4 must match exactly (https, no trailing slash). |
| Site loads but login does nothing | Check `AUTH_SECRET` is set, and `ENABLE_DEV_LOGIN` is `false`, in Vercel. |
| "Configuration" error | One of the `AUTH_MICROSOFT_ENTRA_ID_*` values is missing or wrong. |
