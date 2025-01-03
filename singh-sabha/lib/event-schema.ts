import { parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";

export const timeRangeSchema = z.object({
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid start time format")
    .nullable(),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid end time format")
    .nullable(),
});

export const baseEventSchema = timeRangeSchema.extend({
  occassion: z
    .string()
    .min(1, "Occassion missing")
    .min(6, "Occassion too short")
    .max(64, "Occassion too long"),
  type: z.string().min(1, "Type missing"),
  note: z.string().max(128, "Note too long").optional(),
  dateRange: z.object(
    {
      from: z.date(),
      to: z.date().nullish().catch(undefined),
    },
    {
      required_error: "Date range missing",
    },
  ),
  isPublic: z.boolean().default(true),
});

export const superUserEventSchema = baseEventSchema.extend({
  frequency: z.string(),
  selectedDays: z.array(z.string()).optional(),
  selectedMonths: z.array(z.string()).optional(),
  interval: z
    .number()
    .min(1, "Interval must be at least 1")
    .max(365, "Interval can't be over 365")
    .optional(),
  count: z
    .number()
    .min(1, "Count must be at least 1")
    .max(365, "Count can't be over 365")
    .optional(),
});

export const userEventSchema = baseEventSchema.extend({
  name: z.string().min(1, "Full name missing").max(128, "Full name too long"),
  email: z.string().min(1, "Email missing").email("Invalid email"),
  phoneNumber: z
    .string()
    .min(1, "Phone number missing")
    .refine((value) => {
      if (!value) return true;
      const phoneNumber = parsePhoneNumberFromString(value, "CA");
      return phoneNumber?.isValid();
    }, "Invalid phone number")
    .transform((value) => {
      if (!value) return value;
      const phoneNumber = parsePhoneNumberFromString(value, "CA");
      return phoneNumber ? phoneNumber.formatInternational() : value;
    }),
});
