"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/db";
import { userTable } from "@/db/schema";

import type { User } from "@/db/schema";

export const GetAllUsers = async (): Promise<Omit<User, "passwordHash">[]> => {
  try {
    const users = await db
      .select({
        id: userTable.id,
        fullName: userTable.fullName,
        email: userTable.email,
        isAdmin: userTable.isAdmin,
      })
      .from(userTable);

    revalidatePath("/admin");

    return users;
  } catch (err) {
    throw new Error(`Could not fetch users: ${err}`);
  }
};
