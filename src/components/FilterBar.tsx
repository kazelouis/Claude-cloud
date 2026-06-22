"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  DIRECTION_LABEL,
  DIRECTIONS,
  OFFICE_GROUPS,
  SORT_OPTIONS,
  DEFAULT_SORT,
} from "@/lib/constants";

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
      next.delete("saved");
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  const activeType = params.get("type") ?? "";
  const activeDirection = params.get("direction") ?? "";
  const activeOffice = params.get("office") ?? "";
  const activeSort = params.get("sort") ?? DEFAULT_SORT;
  const search = params.get("q") ?? "";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
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

        <div className="flex items-center gap-2 text-sm text-stone-500">
          <label htmlFor="sort">Sort by</label>
          <select
            id="sort"
            value={activeSort}
            onChange={(e) => setParam("sort", e.target.value)}
            className="rounded-full border border-amber-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 outline-none focus:border-brand"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          defaultValue={search}
          placeholder="Search location…"
          onChange={(e) => setParam("q", e.target.value)}
          className="min-w-[180px] flex-1 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm outline-none focus:border-brand"
        />
        <select
          value={activeOffice}
          onChange={(e) => setParam("office", e.target.value)}
          className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm outline-none focus:border-brand"
        >
          <option value="">All offices</option>
          {OFFICE_GROUPS.map((group) => (
            <optgroup key={group.region} label={group.region}>
              {group.offices.map((office) => (
                <option key={office} value={office}>
                  {office}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
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
