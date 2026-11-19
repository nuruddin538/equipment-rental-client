import { requireRole } from "@/lib/require-role";
import { ReactNode } from "react";

export default async function CustomerLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole(["customer"]);
  return children;
}
