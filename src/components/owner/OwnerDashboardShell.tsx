"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { LoaderCircle } from "lucide-react";
import OwnerSidebar from "./OwnerSidebar";

export default function OwnerDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as
    | { role?: string; name?: string; email?: string }
    | undefined;

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace("/signin?callbackUrl=/dashboard/owner");
      return;
    }
    if (user?.role !== "owner") {
      router.replace("/");
    }
  }, [session, isPending, user?.role, router]);

  if (isPending || !session || user?.role !== "owner") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F1E8]">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle size={36} className="animate-spin text-[#F07842]" />
          <p className="text-sm font-medium text-[#14211F]">
            Securing your workspace...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#F4F1E8] lg:flex">
      <OwnerSidebar />

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
