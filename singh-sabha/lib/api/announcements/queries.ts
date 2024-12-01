"use server";

import { db } from "@/db/db";
import { announcementTable } from "@/db/schema";
import { eq } from "drizzle-orm";

import type { Announcement } from "@/db/schema";

export const GetActiveAnnouncement = async (): Promise<Announcement[]> => {
  try {
    const announcement = await db
      .select()
      .from(announcementTable)
      .where(eq(announcementTable.isActive, true));
    return announcement;
  } catch (err) {
    throw new Error(`Could not fetch active announcement: ${err}`);
  }
};

export const GetAllAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const announcement = await db.select().from(announcementTable);
    return announcement;
  } catch (err) {
    throw new Error(`Could not fetch announcements: ${err}`);
  }
};
