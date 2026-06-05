import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/board");

  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-brand-ink">
            🚗 A BGC community
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-stone-800 sm:text-5xl">
            Share the ride.
            <br />
            <span className="text-brand">Commute together.</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-stone-600">
            Coordinate carpools with fellow BGC employees during snow, heavy
            rain, transit disruptions, and other tough commute days — safer,
            easier, and more connected.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signin"
              className="rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-amber-700"
            >
              Sign in with your BGC email
            </Link>
          </div>
          <p className="mt-3 text-sm text-stone-500">
            Open to BGC employees only.
          </p>
        </div>

        <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-stone-800">How it works</h2>
          <ul className="mt-4 space-y-4">
            <Step icon="🪑" title="Drivers offer seats">
              Post the seats you have available on your commute.
            </Step>
            <Step icon="🙋" title="Riders request a lift">
              Find a nearby driver heading your way, to or from the office.
            </Step>
            <Step icon="🤝" title="Connect & share costs">
              Coordinate pickup and split parking or gas when it makes sense.
            </Step>
          </ul>
        </div>
      </section>

      <section className="grid gap-4 pb-16 sm:grid-cols-3">
        <Value title="Safer" body="Travel together through difficult weather." />
        <Value title="Easier" body="Less stress and fewer cars on bad days." />
        <Value title="Connected" body="Support coworkers and share the costs." />
      </section>
    </div>
  );
}

function Step({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="text-2xl" aria-hidden>
        {icon}
      </span>
      <div>
        <p className="font-semibold text-stone-800">{title}</p>
        <p className="text-sm text-stone-600">{children}</p>
      </div>
    </li>
  );
}

function Value({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-amber-100 bg-white/70 p-5">
      <p className="font-bold text-brand-ink">{title}</p>
      <p className="mt-1 text-sm text-stone-600">{body}</p>
    </div>
  );
}
