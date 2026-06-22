import { z } from "zod";
import { RIDE_TYPES, DIRECTIONS, WEEKDAYS, OFFICES } from "./constants";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
const notARoute = (v: string) => !/(→|->|\sto\s)/i.test(v);

export const rideSchema = z
  .object({
    type: z.enum(RIDE_TYPES),
    direction: z.enum(DIRECTIONS),
    office: z
      .string()
      .trim()
      .refine((v) => OFFICES.includes(v), "Please choose a BGC office"),
    area: z
      .string()
      .trim()
      .min(2, "Please enter a starting location")
      .max(120)
      .refine(notARoute, "Enter a single location, not a route"),
    destination: z
      .string()
      .trim()
      .min(2, "Please enter a destination")
      .max(120)
      .refine(notARoute, "Enter a single location, not a route"),
    recurring: z.boolean().default(false),
    date: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v ? v : undefined)),
    daysOfWeek: z.array(z.enum(WEEKDAYS)).default([]),
    arrivalTime: z
      .string()
      .trim()
      .regex(timeRegex, "Use HH:MM")
      .optional()
      .or(z.literal("").transform(() => undefined)),
    departureTime: z
      .string()
      .trim()
      .regex(timeRegex, "Use HH:MM")
      .optional()
      .or(z.literal("").transform(() => undefined)),
    seats: z.coerce.number().int().min(1).max(8).default(1),
    costShare: z.string().trim().max(280).optional(),
    notes: z.string().trim().max(1000).optional(),
  })
  .refine((d) => d.recurring || !!d.date, {
    message: "Pick a date, or mark the ride as recurring",
    path: ["date"],
  })
  .refine((d) => !d.recurring || d.daysOfWeek.length > 0, {
    message: "Choose at least one day for a recurring ride",
    path: ["daysOfWeek"],
  });

export type RideInput = z.infer<typeof rideSchema>;

export const responseSchema = z.object({
  rideId: z.string().min(1),
  message: z.string().trim().max(500).optional(),
});
