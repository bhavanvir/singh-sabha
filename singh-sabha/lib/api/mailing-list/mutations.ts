"use server";

import { db } from "@/db/db";
import { mailTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const AddEmail = async ({ email }: { email: string }): Promise<void> => {
  if (!email) {
    throw new Error("Missing required parameter to add to mailing list");
  }

  try {
    await db.insert(mailTable).values({ email });
  } catch (err) {
    throw new Error(`Could not update password: ${err}`);
  }
};

export const RemoveEmail = async ({ id }: { id: string }): Promise<void> => {
  if (!id) {
    throw new Error("Missing required parameter to add to mailing list");
  }

  try {
    await db.delete(mailTable).where(eq(mailTable.id, id));
  } catch (err) {
    throw new Error(`Could not update password: ${err}`);
  }
};
