import type { ReactNode } from "react";
import OwnerDashboardShell from "@/components/owner/OwnerDashboardShell";

export default function OwnerLayout({ children }: { children: ReactNode }) {
  return <OwnerDashboardShell>{children}</OwnerDashboardShell>;
}
