# Setting up Microsoft sign-in (BGC employees only)

This guide turns on the **"Continue with Microsoft"** button so that only real
BGC employees can sign in. The code already supports it — you just need to
register the app in Microsoft once and paste three values into your `.env`.

> **Who can do this?** Registering the app and creating a secret may require
> permission in BGC's Microsoft tenant. If you don't have access, hand this
> page to BGC IT — it's about a 10-minute task for them. The key setting that
> restricts access to BGC is **"Single tenant"** in Step 2.

---

## Part A — Register the app in Microsoft (one time)

1. Go to **https://entra.microsoft.com** and sign in with a BGC admin account.
   (Or **portal.azure.com → Microsoft Entra ID**.)

2. In the left menu: **App registrations → + New registration**.
   - **Name:** `BGC Carpool`
   - **Supported account types:** select
     **"Accounts in this organizational directory only (BGC only - Single tenant)"**.
     👉 *This is what limits sign-in to BGC employees.*
   - **Redirect URI:** choose platform **Web**, and enter — for local testing:
     ```
     http://localhost:3000/api/auth/callback/microsoft-entra-id
     ```
   - Click **Register**.

3. On the app's **Overview** page, copy these two values:
   - **Application (client) ID**  → you'll use it as `AUTH_MICROSOFT_ENTRA_ID_ID`
   - **Directory (tenant) ID**     → you'll use it in the issuer URL below

4. Create a secret: left menu **Certificates & secrets → + New client secret**.
   - Description: `carpool`, Expiry: 12–24 months.
   - Click **Add**, then **immediately copy the `Value`** (not the "Secret ID").
     ⚠️ It's only shown once. This is `AUTH_MICROSOFT_ENTRA_ID_SECRET`.

5. (Permissions are fine by default — `User.Read`, `openid`, `profile`, `email`
   are included automatically. No admin consent needed for these.)

### When you deploy to a real URL later
Add a second redirect URI in **Authentication → Add a platform / Add URI**:
```
https://YOUR-LIVE-DOMAIN/api/auth/callback/microsoft-entra-id
```

---

## Part B — Put the values into the app

Open the `.env` file in the project and fill in:

```dotenv
# Turn OFF the dev email login so ONLY the Microsoft button shows:
ENABLE_DEV_LOGIN="false"

# Keep the domain backstop:
ALLOWED_EMAIL_DOMAIN="bgcengineering.ca"

# From Part A:
AUTH_MICROSOFT_ENTRA_ID_ID="<Application (client) ID>"
AUTH_MICROSOFT_ENTRA_ID_SECRET="<the secret Value you copied>"
# Replace <tenant-id> with the Directory (tenant) ID. The /v2.0 is required.
AUTH_MICROSOFT_ENTRA_ID_ISSUER="https://login.microsoftonline.com/<tenant-id>/v2.0"
```

Using the **tenant-specific** issuer (your real `<tenant-id>`, not `common`)
is the second half of the BGC-only lock.

---

## Part C — Restart and test

```powershell
npm run dev
```

Open **http://localhost:3000** → you should now see a single
**"Continue with Microsoft"** button. Click it:
- If you're already signed into Microsoft 365, you go straight in.
- Otherwise Microsoft asks for your BGC email once, then you're in.
- Anyone outside BGC is refused by Microsoft automatically.

---

## Troubleshooting

| Message | Fix |
| --- | --- |
| `redirect_uri mismatch` | The URL in Microsoft (Step 2) must match exactly, including `http`/`https` and no trailing slash. |
| `AADSTS700016` / app not found | Double-check `AUTH_MICROSOFT_ENTRA_ID_ID` and that the issuer tenant ID is correct. |
| Microsoft button doesn't appear | `AUTH_MICROSOFT_ENTRA_ID_ID` is empty, or you didn't restart `npm run dev`. |
| Still see the email box | Set `ENABLE_DEV_LOGIN="false"` and restart. |
| `invalid_client` | The secret is wrong/expired — create a new client secret (Step 4). |
