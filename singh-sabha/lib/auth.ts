import { userTable, sessionTable } from "@/db/schema";
import { db } from "@/db/db";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

import type { User, Session } from "@/db/schema";

const SESSION_REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 24 * 15;
const SESSION_MAX_DURATION_MS = SESSION_REFRESH_INTERVAL_MS * 2;
const SESSION_COOKIE_NAME = "session";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  userId: string,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + SESSION_MAX_DURATION_MS),
  };
  await db.insert(sessionTable).values(session);
  return session;
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const sessionInDb = await db.query.sessionTable.findFirst({
    where: eq(sessionTable.id, sessionId),
  });
  if (!sessionInDb) {
    return { session: null, user: null };
  }
  if (Date.now() >= sessionInDb.expiresAt.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionInDb.id));
    return { session: null, user: null };
  }
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, sessionInDb.userId),
  });

  if (!user) {
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionInDb.id));
    return { session: null, user: null };
  }

  if (
    Date.now() >=
    sessionInDb.expiresAt.getTime() - SESSION_REFRESH_INTERVAL_MS
  ) {
    sessionInDb.expiresAt = new Date(Date.now() + SESSION_MAX_DURATION_MS);
    await db
      .update(sessionTable)
      .set({
        expiresAt: sessionInDb.expiresAt,
      })
      .where(eq(sessionTable.id, sessionInDb.id));
  }
  return { session: sessionInDb, user };
}

export function deleteSessionTokenCookie(): void {
  cookies().set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function invalidateUserSessions(userId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(userTable.id, userId));
}

export function getSessionToken(): string | undefined {
  return cookies().get(SESSION_COOKIE_NAME)?.value;
}

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function validateRequest(): Promise<SessionValidationResult> {
  const sessionToken = getSessionToken();
  if (!sessionToken) {
    return { session: null, user: null };
  }
  return validateSessionToken(sessionToken);
}

export interface DatabaseUser {
  fullName: string;
  email: string;
  isAdmin: boolean;
  isMod: boolean;
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
