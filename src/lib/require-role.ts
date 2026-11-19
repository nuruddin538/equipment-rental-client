import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export type UserRole = "customer" | "owner" | "admin";

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  const role = session.user.role as UserRole;

  if (!allowedRoles.includes(role)) {
    redirect("/dashboard");
  }
  return session;
}
