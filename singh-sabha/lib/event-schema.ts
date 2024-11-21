import { parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";

const baseEventSchema = z.object({
  title: z
    .string()
    .min(1, "Title missing")
    .min(6, "Title too short")
    .max(64, "Title too long"),
  type: z.string().min(1, "Type missing"),
  note: z.string().max(128, "Note too long"),
  dateRange: z.object(
    {
      from: z.date(),
      to: z.date().nullish().catch(undefined),
    },
    {
      required_error: "Date range missing",
    },
  ),
  timeRange: z.array(z.number()).length(2),
  isPublic: z.boolean().default(true),
});

const superUserEventSchema = baseEventSchema.extend({
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

const userEventSchema = baseEventSchema.extend({
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

export { baseEventSchema, superUserEventSchema, userEventSchema };
