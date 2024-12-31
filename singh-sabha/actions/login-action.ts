"use server";

import { db } from "@/db/db";
import { verify } from "@node-rs/argon2";
import { userTable } from "@/db/schema";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function login(values: { email: string; password: string }) {
  const { email, password } = values;

  const existingUser = await db.query.userTable.findFirst({
    where: eq(userTable.email, email),
  });

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

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, existingUser.id);

  await setSessionTokenCookie(sessionToken, session.expiresAt);

  return redirect("/admin");
}
