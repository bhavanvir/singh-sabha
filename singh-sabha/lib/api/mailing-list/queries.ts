"use server";

import { db } from "@/db/db";
import { mailTable } from "@/db/schema";

import type { MailingList } from "@/db/schema";

export const GetMailingList = async (): Promise<MailingList[]> => {
  try {
    const mailingList = await db.select().from(mailTable);
    return mailingList;
  } catch (err) {
    throw new Error(`Could not fetch mailing list: ${err}`);
  }
};
