"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { DIRECTION_LABEL, DIRECTIONS } from "@/lib/constants";

const TYPE_TABS = [
  { value: "", label: "All rides" },
  { value: "OFFER", label: "🪑 Offers" },
  { value: "REQUEST", label: "🙋 Requests" },
];

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete("posted");
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  const activeType = params.get("type") ?? "";
  const activeDirection = params.get("direction") ?? "";
  const search = params.get("q") ?? "";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setParam("type", tab.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeType === tab.value
                ? "bg-brand text-white shadow-sm"
                : "bg-white text-stone-600 hover:bg-amber-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          defaultValue={search}
          placeholder="Search by area…"
          onChange={(e) => setParam("q", e.target.value)}
          className="min-w-[180px] flex-1 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm outline-none focus:border-brand"
        />
        <select
          value={activeDirection}
          onChange={(e) => setParam("direction", e.target.value)}
          className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm outline-none focus:border-brand"
        >
          <option value="">Any direction</option>
          {DIRECTIONS.map((d) => (
            <option key={d} value={d}>
              {DIRECTION_LABEL[d]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
