"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  ClipboardList,
  Heart,
  UserRound,
  LogOut,
  X,
  ShoppingBag,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard/customer",
    icon: LayoutDashboard,
  },
  {
    label: "My Rentals",
    href: "/dashboard/customer/rentals",
    icon: ClipboardList,
  },
  {
    label: "Favorites",
    href: "/dashboard/customer/favorites",
    icon: Heart,
  },
  {
    label: "My Profile",
    href: "/dashboard/customer/profile",
    icon: UserRound,
  },
];

interface CustomerSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function CustomerSidebar({
  mobileOpen,
  onClose,
}: CustomerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.replace("/signin");
      router.refresh();
    } catch {
      router.replace("/signin");
    }
  };

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#101B18]/55 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col bg-[#14211F] text-[#F4F1E8] transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-7">
          <Link
            href="/dashboard/customer"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F07842]">
              <ShoppingBag size={21} />
            </div>

            <div>
              <p className="text-lg font-black tracking-[0.16em]">EQUIPORA</p>
              <p className="text-[9px] tracking-[0.28em] text-[#C9DB83]">
                CUSTOMER SPACE
              </p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className="px-6 pb-3 pt-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
            Your workspace
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/dashboard/customer" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all",
                  active
                    ? "bg-[#C9DB83] text-[#14211F]"
                    : "text-white/65 hover:bg-white/8 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#F07842]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-4 rounded-xl bg-white/5 p-4">
            <p className="text-xs font-semibold">Your rental space</p>
            <p className="mt-1 text-[11px] text-white/40">
              Manage bookings and saved equipment
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/65 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
