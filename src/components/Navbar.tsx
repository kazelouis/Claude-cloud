import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Avatar } from "./Avatar";
import { MobileNav } from "./MobileNav";

export async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-amber-100 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3 sm:gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-ink">
          <span className="text-2xl" aria-hidden>
            🚗
          </span>
          <span className="whitespace-nowrap text-base sm:text-lg">
            BGC Carpool
          </span>
        </Link>

        {user && (
          <div className="ml-2 hidden gap-1 sm:flex">
            <NavLink href="/board">Ride board</NavLink>
            <NavLink href="/my-rides">My rides</NavLink>
          </div>
        )}

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/rides/new"
                className="hidden rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 sm:inline-flex"
              >
                + Post a ride
              </Link>
              <div className="flex items-center gap-2">
                <Avatar name={user.name} email={user.email} size={32} />
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button
                    type="submit"
                    className="whitespace-nowrap text-sm text-stone-500 hover:text-stone-800"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </>
          ) : (
            <Link
              href="/signin"
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
      </header>
      {user && <MobileNav />}
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-amber-50 hover:text-brand-ink"
    >
      {children}
    </Link>
  );
}
