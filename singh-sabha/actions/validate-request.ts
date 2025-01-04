"use server";

import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export const validateProtected = async () => {
  const req = await validateRequest();
  if (!req.session) {
    redirect("/admin/sign-in");
  }

  return req;
};
