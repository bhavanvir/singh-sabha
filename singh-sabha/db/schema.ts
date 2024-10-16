import { sql } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, check } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const userTable = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const eventTable = pgTable(
  "event",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    registrantFullName: text("registrant_full_name"),
    registrantEmail: text("registrant_email"),
    registrantPhoneNumber: text("registrant_phone_number"),
    type: text("type").notNull(),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    isAllDay: boolean("is_all_day").notNull().default(false),
    title: text("title").notNull(),
  },
  (table) => ({
    checkConstraint: check(
      "time_period_check",
      sql`${table.endTime} > ${table.startTime}`,
    ),
  }),
);
