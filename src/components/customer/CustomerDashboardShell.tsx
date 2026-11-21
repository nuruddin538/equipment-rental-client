"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ShoppingBag } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import CustomerSidebar from "./CustomerSidebar";

export default function CustomerDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();

  const [mobileOpen, setMobileOpen] = useState(false);

  const user = session?.user as
    | (NonNullable<typeof session>["user"] & {
        role?: string;
      })
    | undefined;

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace(`/signin?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user?.role !== "customer") {
      router.replace("/unauthorized");
    }
  }, [isPending, session, user?.role, router, pathname]);

  if (isPending || !session || user?.role !== "customer") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F1E8]">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-[#14211F] text-[#C9DB83]">
            <ShoppingBag size={25} />
          </div>

          <p className="mt-4 text-sm font-semibold text-[#14211F]">
            Verifying customer access...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F1E8] text-[#14211F]">
      <CustomerSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-h-screen lg:pl-[270px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#14211F]/10 bg-[#F4F1E8]/95 px-5 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-[#14211F]/10 p-2 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F07842]">
                EQUIPORA / CUSTOMER
              </p>
              <p className="text-sm font-semibold">Your dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#14211F]/10 bg-white px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#8BA94E]" />
            <span className="text-xs font-semibold">Customer</span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-5 sm:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
