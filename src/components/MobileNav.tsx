"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/board", label: "Board", icon: "🚗" },
  { href: "/rides/new", label: "Post", icon: "➕" },
  { href: "/my-rides", label: "My rides", icon: "📋" },
];

// App-style bottom tab bar, shown only on small screens.
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-amber-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-5xl">
        {ITEMS.map((item) => {
          const active =
            item.href === "/rides/new"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-semibold transition ${
                active ? "text-brand-ink" : "text-stone-500"
              }`}
            >
              <span className="text-xl leading-none" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
