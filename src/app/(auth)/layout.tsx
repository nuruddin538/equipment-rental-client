import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <main className="min-h-screen bg-[#F4F1E8]">{children}</main>;
}
