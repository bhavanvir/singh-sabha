"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/db";
import { userTable, otpTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { hash } from "@node-rs/argon2";

import type { User } from "@/db/schema";

export const UpdateUserPrivilege = async ({
  user,
}: {
  user: Omit<User, "passwordHash">;
}): Promise<void> => {
  if (!user.id) {
    throw new Error("Missing required parameter to update a user's privilege");
  }

  try {
    await db
      .update(userTable)
      .set({
        isMod: user.isMod,
        isAdmin: user.isAdmin,
      })
      .where(eq(userTable.id, user.id));

    revalidatePath("/admin");
  } catch (err) {
    throw new Error(`Could not update user's privileges: ${err}`);
  }
};

export const DeleteUser = async ({ id }: { id: string }): Promise<void> => {
  if (!id) {
    throw new Error("Missing required parameter to delete a user");
  }

  try {
    await db.delete(userTable).where(eq(userTable.id, id));

    revalidatePath("/admin");
  } catch (err) {
    throw new Error(`Could not delete user: ${err}`);
  }
};

export const CreateMod = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<void> => {
  if (!name || !email || !password) {
    throw new Error("Missing component needed to create an account");
  }

  try {
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    await db.insert(userTable).values({
      fullName: name,
      email: email,
      passwordHash: passwordHash,
      isMod: true,
    });

    revalidatePath("/admin");
  } catch (err) {
    throw new Error(`Could not create a user: ${err}`);
  }
};

export const AddOtp = async ({
  otp,
  issuer,
}: {
  otp: string;
  issuer: string;
}): Promise<void> => {
  if (!otp) {
    throw new Error("One-time pasword is required to insert");
  }

  if (!issuer) {
    throw new Error("User id is required to tie to a one-time password");
  }

  try {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    await db.insert(otpTable).values({
      otp: otp,
      issuer,
      expiresAt: expiresAt,
    });
  } catch (err) {
    throw new Error(`Could not insert one-time password: ${err}`);
  }
};

export const ValidateOtp = async ({ otp }: { otp: string }): Promise<void> => {
  if (!otp) {
    throw new Error("One-time pasword is required to validate");
  }

  try {
    const [otpEntry] = await db
      .select()
      .from(otpTable)
      .where(and(eq(otpTable.otp, otp), eq(otpTable.used, false)));

    if (!otp) {
      throw new Error("No such one-time password");
    }

    if (new Date() > new Date(otpEntry.expiresAt)) {
      throw new Error("One-time password is expired");
    }

    await db
      .update(otpTable)
      .set({ used: true })
      .where(eq(otpTable.id, otpEntry.id));
  } catch (err) {
    throw new Error(`Could not validate one-time password: ${err}`);
  }
};

export const ChangeEmail = async ({
  id,
  email,
}: {
  id: string;
  email: string;
}): Promise<void> => {
  if (!id || !email) {
    throw new Error("Missing required parameter(s) to update email");
  }

  try {
    await db
      .update(userTable)
      .set({ email: email })
      .where(eq(userTable.id, id));
  } catch (err) {
    throw new Error(`Could not update email: ${err}`);
  }
};

export const ChangePassword = async ({
  id,
  password,
}: {
  id: string;
  password: string;
}): Promise<void> => {
  if (!id || !password) {
    throw new Error("Missing required parameter(s) to update email");
  }

  try {
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    await db
      .update(userTable)
      .set({ passwordHash: passwordHash })
      .where(eq(userTable.id, id));
  } catch (err) {
    throw new Error(`Could not update password: ${err}`);
  }
};
