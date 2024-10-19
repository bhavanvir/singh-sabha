"use server";

import { db } from "@/db/db";
import { verify } from "@node-rs/argon2";
import { userTable } from "@/db/schema";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function login(values: { email: string; password: string }) {
  const { email, password } = values;

  const [existingUser] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));
  if (!existingUser) {
    throw new Error("Incorrect username or password");
  }

  const validPassword = await verify(existingUser.passwordHash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  if (!validPassword) {
    throw new Error("Incorrect username or password");
  }
  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return;
}
