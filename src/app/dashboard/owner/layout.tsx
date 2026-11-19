import { requireRole } from "@/lib/require-role";
import { ReactNode } from "react";

export default async function OwnerLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole(["owner"]);
  return children;
}
