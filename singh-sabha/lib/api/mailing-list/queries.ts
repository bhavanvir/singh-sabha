"use server";

import { cache } from "react";
import { db } from "@/db/db";
import { mailTable } from "@/db/schema";

export const GetMailingList = cache(async (): Promise<any> => {
  try {
    const mailingList = await db.select().from(mailTable);
    return mailingList;
  } catch (err) {
    throw new Error(`Could not fetch mailing list: ${err}`);
  }
});
