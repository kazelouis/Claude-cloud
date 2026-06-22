"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileFormState } from "@/app/actions/profile";
import { OFFICE_GROUPS } from "@/lib/constants";

const initialState: ProfileFormState = {};

export function ProfileForm({
  homeOffice,
  homeArea,
}: {
  homeOffice: string | null;
  homeArea: string | null;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState,
  );

  const inputCls =
    "mt-1 w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 outline-none focus:border-brand";

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-stone-700">
          Your office
          <span className="ml-1 font-normal text-stone-400">
            (pre-fills new posts)
          </span>
        </label>
        <select
          name="homeOffice"
          defaultValue={homeOffice ?? ""}
          className={inputCls}
        >
          <option value="">No default</option>
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
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">
          Your home area
          <span className="ml-1 font-normal text-stone-400">
            (a city or part of town — pre-fills new posts)
          </span>
        </label>
        <input
          name="homeArea"
          defaultValue={homeArea ?? ""}
          placeholder="e.g. Calgary — Beltline, or North Vancouver"
          className={inputCls}
        />
        <p className="mt-1 text-xs text-stone-400">
          Just where you start from — not a route. The board still shows rides
          for every office.
        </p>
      </div>

      {state.error && (
        <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
