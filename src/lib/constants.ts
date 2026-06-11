// Shared domain constants and human-friendly labels.
// SQLite has no enums, so these string unions are the source of truth.

export const RIDE_TYPES = ["OFFER", "REQUEST"] as const;
export type RideType = (typeof RIDE_TYPES)[number];

export const DIRECTIONS = ["TO_WORK", "FROM_WORK", "ROUND_TRIP"] as const;
export type Direction = (typeof DIRECTIONS)[number];

export const STATUSES = ["OPEN", "FULFILLED", "CANCELLED"] as const;
export type Status = (typeof STATUSES)[number];

export const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

// BGC offices, grouped by region for the dropdowns.
export const OFFICE_GROUPS: { region: string; offices: string[] }[] = [
  {
    region: "Canada",
    offices: [
      "Calgary, AB",
      "Edmonton, AB",
      "Fredericton, NB",
      "Halifax, NS",
      "Kamloops, BC",
      "Kelowna, BC",
      "Kingston, ON",
      "Montreal, QC",
      "Ottawa, ON",
      "Quebec City, QC",
      "Surrey, BC",
      "Toronto, ON",
      "Vancouver, BC",
      "Victoria, BC",
    ],
  },
  { region: "United States", offices: ["Colorado, US", "Tennessee, US"] },
  { region: "United Kingdom", offices: ["London, UK"] },
  { region: "Australia", offices: ["Brisbane, AU"] },
  {
    region: "Latin America",
    offices: ["Santiago, CL", "Santo Domingo, DO"],
  },
];

// Flat list of all office values, used for validation and filtering.
export const OFFICES: string[] = OFFICE_GROUPS.flatMap((g) => g.offices);

export const RIDE_TYPE_LABEL: Record<RideType, string> = {
  OFFER: "Offering a ride",
  REQUEST: "Looking for a ride",
};

export const RIDE_TYPE_SHORT: Record<RideType, string> = {
  OFFER: "Offer",
  REQUEST: "Request",
};

export const DIRECTION_LABEL: Record<Direction, string> = {
  TO_WORK: "To work",
  FROM_WORK: "From work",
  ROUND_TRIP: "Round trip",
};

export const STATUS_LABEL: Record<Status, string> = {
  OPEN: "Open",
  FULFILLED: "Matched",
  CANCELLED: "Cancelled",
};

export const WEEKDAY_LABEL: Record<Weekday, string> = {
  MON: "Mon",
  TUE: "Tue",
  WED: "Wed",
  THU: "Thu",
  FRI: "Fri",
  SAT: "Sat",
  SUN: "Sun",
};
