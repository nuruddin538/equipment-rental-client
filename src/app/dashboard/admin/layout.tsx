import { requireRole } from "@/lib/require-role";
import { ReactNode } from "react";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole(["admin"]);
  return children;
}
