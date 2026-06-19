"use client";

import { useActionState, useState } from "react";
import type { RideFormState } from "@/app/actions/rides";
import {
  DIRECTION_LABEL,
  DIRECTIONS,
  OFFICE_GROUPS,
  RIDE_TYPE_LABEL,
  WEEKDAYS,
  WEEKDAY_LABEL,
  type RideType,
} from "@/lib/constants";

const initialState: RideFormState = {};

export type RideDefaults = {
  type?: RideType;
  direction?: string;
  office?: string;
  area?: string;
  recurring?: boolean;
  date?: string; // yyyy-MM-dd
  daysOfWeek?: string[];
  arrivalTime?: string;
  departureTime?: string;
  seats?: number;
  costShare?: string;
  notes?: string;
};

export function RideForm({
  action,
  defaults,
  submitLabel = "Post ride",
}: {
  action: (state: RideFormState, formData: FormData) => Promise<RideFormState>;
  defaults?: RideDefaults;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [type, setType] = useState<RideType>(defaults?.type ?? "OFFER");
  const [recurring, setRecurring] = useState(defaults?.recurring ?? false);

  const fe = state.fieldErrors ?? {};
  const isOffer = type === "OFFER";

  return (
    <form action={formAction} className="space-y-6">
      {/* Type toggle */}
      <input type="hidden" name="type" value={type} />
      <div className="grid grid-cols-2 gap-3">
        {(["OFFER", "REQUEST"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`rounded-2xl border-2 p-4 text-left transition ${
              type === t
                ? "border-brand bg-amber-50"
                : "border-stone-200 bg-white hover:border-amber-200"
            }`}
          >
            <span className="text-2xl" aria-hidden>
              {t === "OFFER" ? "🪑" : "🙋"}
            </span>
            <p className="mt-1 font-semibold text-stone-800">
              {RIDE_TYPE_LABEL[t]}
            </p>
            <p className="text-xs text-stone-500">
              {t === "OFFER"
                ? "I'm driving and have seats"
                : "I need a seat in someone's car"}
            </p>
          </button>
        ))}
      </div>

      <Field
        label="BGC office"
        hint="which office this commute is for"
        error={fe.office}
      >
        <select
          name="office"
          required
          defaultValue={defaults?.office ?? ""}
          className={inputCls}
        >
          <option value="" disabled>
            Select an office…
          </option>
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
      </Field>

      <Field label="Direction" error={fe.direction}>
        <select
          name="direction"
          className={inputCls}
          defaultValue={defaults?.direction ?? "TO_WORK"}
        >
          {DIRECTIONS.map((d) => (
            <option key={d} value={d}>
              {DIRECTION_LABEL[d]}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Area / neighbourhood"
        hint="Where you're starting from (or your general area)"
        error={fe.area}
      >
        <input
          name="area"
          required
          defaultValue={defaults?.area}
          placeholder="e.g. North Vancouver — Lonsdale"
          className={inputCls}
        />
      </Field>

      {/* When */}
      <div className="rounded-2xl bg-amber-50/60 p-4">
        <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
          <input
            type="checkbox"
            name="recurring"
            checked={recurring}
            onChange={(e) => setRecurring(e.target.checked)}
            className="h-4 w-4 rounded border-stone-300 text-brand"
          />
          This is a recurring / regular commute
        </label>

        {recurring ? (
          <div className="mt-3">
            <p className="text-sm text-stone-600">Which days?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {WEEKDAYS.map((d) => (
                <label
                  key={d}
                  className="cursor-pointer rounded-full border border-amber-200 bg-white px-3 py-1.5 text-sm has-[:checked]:border-brand has-[:checked]:bg-brand has-[:checked]:text-white"
                >
                  <input
                    type="checkbox"
                    name="daysOfWeek"
                    value={d}
                    defaultChecked={defaults?.daysOfWeek?.includes(d)}
                    className="sr-only"
                  />
                  {WEEKDAY_LABEL[d]}
                </label>
              ))}
            </div>
            {fe.daysOfWeek && (
              <p className="mt-1 text-sm text-rose-600">{fe.daysOfWeek[0]}</p>
            )}
          </div>
        ) : (
          <div className="mt-3">
            <Field label="Date" error={fe.date}>
              <input
                type="date"
                name="date"
                defaultValue={defaults?.date}
                className={inputCls}
              />
            </Field>
          </div>
        )}
      </div>

      {/* Times */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Arrive at office by" hint="optional" error={fe.arrivalTime}>
          <input
            type="time"
            name="arrivalTime"
            defaultValue={defaults?.arrivalTime}
            className={inputCls}
          />
        </Field>
        <Field label="Leave office at" hint="optional" error={fe.departureTime}>
          <input
            type="time"
            name="departureTime"
            defaultValue={defaults?.departureTime}
            className={inputCls}
          />
        </Field>
      </div>

      <Field
        label={isOffer ? "Seats available" : "Seats needed"}
        error={fe.seats}
      >
        <input
          type="number"
          name="seats"
          min={1}
          max={8}
          defaultValue={defaults?.seats ?? 1}
          className={inputCls}
        />
      </Field>

      <Field
        label="Cost-share expectations"
        hint="optional — e.g. split parking, share gas"
        error={fe.costShare}
      >
        <input
          name="costShare"
          defaultValue={defaults?.costShare}
          placeholder="e.g. Happy to split parking"
          className={inputCls}
        />
      </Field>

      <Field label="Notes" hint="optional" error={fe.notes}>
        <textarea
          name="notes"
          rows={3}
          defaultValue={defaults?.notes}
          placeholder="Anything else helpful — flexibility, route, contact preferences…"
          className={inputCls}
        />
      </Field>

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
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

const inputCls =
  "mt-1 w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 outline-none focus:border-brand";

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700">
        {label}
        {hint && <span className="ml-1 font-normal text-stone-400">({hint})</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-rose-600">{error[0]}</p>}
    </div>
  );
}
