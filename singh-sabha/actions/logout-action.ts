"use server";

import {
  validateRequest,
  invalidateSession,
  deleteSessionTokenCookie,
} from "@/lib/auth";
import { redirect } from "next/navigation";

export async function logout() {
  const { session } = await validateRequest();

  if (!session) {
    throw new Error("Unauthorized");
  }

  await invalidateSession(session.id);

  deleteSessionTokenCookie();

  return redirect("/admin");
}
