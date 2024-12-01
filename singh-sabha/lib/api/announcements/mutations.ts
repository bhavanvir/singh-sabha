"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/db";
import { announcementTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const CreateAnnouncement = async ({
  title,
  message,
}: {
  title: string;
  message: string;
}): Promise<void> => {
  if (!title || !message) {
    throw new Error("Missing required parameter(s) to create an announcement");
  }

  try {
    await db
      .update(announcementTable)
      .set({ isActive: false })
      .where(eq(announcementTable.isActive, true));

    await db.insert(announcementTable).values({
      title,
      message,
      isActive: true,
      createdAt: new Date(),
    });

    revalidatePath("/");
    revalidatePath("/admin");
  } catch (err) {
    throw new Error(`Failed to create an announcement: ${err}`);
  }
};

export const DisableAnnouncement = async ({
  id,
}: {
  id: string;
}): Promise<void> => {
  if (!id) {
    throw new Error("Missing id to disable an announcement");
  }

  try {
    await db
      .update(announcementTable)
      .set({ isActive: false })
      .where(eq(announcementTable.id, id));

    revalidatePath("/");
    revalidatePath("/admin");
  } catch (err) {
    throw new Error(`Failed to disable an announcement: ${err}`);
  }
};
