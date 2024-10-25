import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
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

export const eventTable = pgTable("event", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  registrantFullName: text("registrant_full_name"),
  registrantEmail: text("registrant_email"),
  registrantPhoneNumber: text("registrant_phone_number"),
  type: text("type").notNull(),
  start: timestamp("start").notNull(),
  end: timestamp("end").notNull(),
  allDay: boolean("all_day").notNull().default(false),
  title: text("title").notNull(),
  note: text("note"),
  verified: boolean("verified").default(false),
  frequencyRule: text("frequency_rule").notNull(),
});
