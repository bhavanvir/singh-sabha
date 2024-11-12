import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const userTable = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  isAdmin: boolean("is_administrator").notNull().default(false),
  isMod: boolean("is_moderator").notNull().default(false),
});

export const otpTable = pgTable("one_time_passwords", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  otp: text("one_time_password").notNull(),
  issuer: text("issuer").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
});

export const sessionTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const eventTypeTable = pgTable("event_types", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  displayName: text("display_name").notNull(),
  isRequestable: boolean("is_requestable").default(false),
  isSpecial: boolean("is_special").default(false),
});

export const eventTable = pgTable("events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  registrantFullName: text("registrant_full_name"),
  registrantEmail: text("registrant_email"),
  registrantPhoneNumber: text("registrant_phone_number"),
  type: text("type")
    .notNull()
    .references(() => eventTypeTable.id),
  start: timestamp("start").notNull(),
  end: timestamp("end").notNull(),
  allDay: boolean("all_day").notNull().default(false),
  title: text("title").notNull(),
  note: text("note"),
  verified: boolean("verified").default(false),
  frequencyRule: text("frequency_rule"),
});

export const mailTable = pgTable("mailing_list", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  email: text("email").notNull().unique(),
});
