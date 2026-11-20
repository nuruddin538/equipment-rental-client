"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Boxes,
  LayoutDashboard,
  PlusCircle,
  Package,
  CalendarCheck,
  UserRound,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard/owner",
    icon: LayoutDashboard,
  },
  {
    label: "Add Equipment",
    href: "/dashboard/owner/add-equipment",
    icon: PlusCircle,
  },
  {
    label: "My Equipment",
    href: "/dashboard/owner/my-equipment",
    icon: Package,
  },
  {
    label: "My Equipment Rental",
    href: "/dashboard/owner/my-rentals",
    icon: CalendarCheck,
  },
  {
    label: "My Profile",
    href: "/dashboard/owner/profile",
    icon: UserRound,
  },
];

export default function OwnerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoggingOut(true);
      await authClient.signOut();
      router.replace("/signin");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 px-6 py-7">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F07842] text-[#14211F]">
          <Boxes size={24} strokeWidth={2.5} />
        </div>

        <div>
          <h1 className="text-xl font-black tracking-[0.12em] text-[#F4F1E8]">
            EQUIPORA
          </h1>
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#C9DB83]">
            OWNER WORKSPACE
          </p>
        </div>
      </div>

      <div className="mx-5 border-t border-white/10" />

      <div className="px-5 pt-7">
        <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#82918A]">
          Management
        </p>

        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard/owner" &&
                pathname.startsWith(item.href));

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-3 transition-all ${
                  active
                    ? "bg-[#F07842] text-[#14211F] shadow-lg shadow-black/10"
                    : "text-[#C6D0CA] hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={19} />
                  <span className="text-sm font-semibold">{item.label}</span>
                </span>

                {active && <ChevronRight size={17} />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto px-5 pb-7 pt-8">
        <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-semibold text-[#C9DB83]">
            EQUIPORA PARTNER
          </p>
          <p className="mt-2 text-sm leading-6 text-[#A9B7B0]">
            Manage your equipment and grow your rental business.
          </p>
        </div>

        <button
          onClick={handleSignOut}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-[#C6D0CA] transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
        >
          <LogOut size={19} />
          {loggingOut ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between bg-[#14211F] px-4 py-3 lg:hidden">
        <Link href="/dashboard/owner" className="flex items-center gap-2">
          <Boxes className="text-[#F07842]" />
          <span className="font-black tracking-widest text-[#F4F1E8]">
            EQUIPORA
          </span>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-white hover:bg-white/10"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      <aside className="sticky top-0 hidden h-screen w-[270px] shrink-0 flex-col bg-[#14211F] lg:flex">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          />

          <aside className="relative flex h-full w-[290px] max-w-[85vw] flex-col bg-[#14211F] shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-2 text-white hover:bg-white/10"
              aria-label="Close menu"
            >
              <X />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
