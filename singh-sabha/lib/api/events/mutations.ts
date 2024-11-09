"use server";

import { db } from "@/db/db";
import { eventTable, mailTable, otpTable, userTable } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";

import type { Event } from "@/lib/types/event";
import { hash } from "@node-rs/argon2";

export const CreateEvent = async ({
  newEvent,
}: {
  newEvent: Event;
}): Promise<void> => {
  try {
    await db.insert(eventTable).values({
      registrantFullName: newEvent.registrantFullName,
      registrantEmail: newEvent.registrantEmail,
      registrantPhoneNumber: newEvent.registrantPhoneNumber,
      type: newEvent.type,
      start: newEvent.start,
      end: newEvent.end,
      allDay: newEvent.allDay,
      title: newEvent.title,
      note: newEvent.note,
      verified: newEvent.verified,
      frequencyRule: newEvent.frequencyRule,
    });
    revalidatePath("/");
  } catch (err) {
    throw new Error(`Could not add an event: ${err}`);
  }
};

export const UpdateEvent = async ({
  updatedEvent,
}: {
  updatedEvent: Event;
}): Promise<void> => {
  if (!updatedEvent.id) {
    throw new Error("Event ID is required for updating");
  }

  try {
    // Remove the id from the update payload since it's the primary key
    const { id, ...updateData } = updatedEvent;

    await db.update(eventTable).set(updateData).where(eq(eventTable.id, id));

    revalidatePath("/");
  } catch (err) {
    throw new Error(`Could not update event: ${err}`);
  }
};

export const DeleteEvent = async ({ id }: { id: string }): Promise<void> => {
  if (!id) {
    throw new Error("Event ID is required to delete event");
  }

  try {
    await db.delete(eventTable).where(eq(eventTable.id, id));
    revalidatePath("/");
  } catch (err) {
    throw new Error(`Could not delete event: ${err}`);
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

export const AddEmail = async ({ email }: { email: string }): Promise<void> => {
  if (!email) {
    throw new Error("Missing required parameter to add to mailing list");
  }

  try {
    await db.insert(mailTable).values({ email });
    revalidatePath("/admin");
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
    revalidatePath("/admin");
  } catch (err) {
    throw new Error(`Could not update password: ${err}`);
  }
};
