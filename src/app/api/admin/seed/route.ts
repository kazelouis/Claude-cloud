import { auth, ALLOWED_DOMAIN } from "@/auth";
import { prisma } from "@/lib/prisma";
import { seedSampleRides } from "@/lib/sampleData";

export const dynamic = "force-dynamic";

// One-click sample-data loader. Requires a signed-in BGC user. Idempotent:
// re-running replaces the 8 sample rides without touching real posts.
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new Response(
      "Please sign in first, then visit this link again.",
      { status: 401, headers: { "content-type": "text/plain" } },
    );
  }

  const { rides } = await seedSampleRides(prisma, ALLOWED_DOMAIN);

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Sample rides added</title>
<style>
  body{font-family:system-ui,sans-serif;background:#fbf7f0;color:#2b2622;
       display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}
  .card{background:#fff;border:1px solid #fde68a;border-radius:24px;padding:40px;
        text-align:center;max-width:420px;box-shadow:0 10px 30px rgba(0,0,0,.06)}
  h1{margin:0 0 8px;color:#92400e}
  a{display:inline-block;margin-top:20px;background:#d97706;color:#fff;
    text-decoration:none;padding:12px 24px;border-radius:9999px;font-weight:600}
</style></head>
<body><div class="card">
  <div style="font-size:48px">🚗</div>
  <h1>Added ${rides} sample rides</h1>
  <p>Your ride board is now populated. You can re-run this any time to reset the samples.</p>
  <a href="/board">Go to the ride board →</a>
</div></body></html>`;

  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
