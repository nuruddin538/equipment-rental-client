"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  UserRound,
  LogOut,
  X,
  ShieldCheck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    label: "All Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    label: "All Equipment",
    href: "/dashboard/admin/equipment",
    icon: Package,
  },
  {
    label: "All Rentals",
    href: "/dashboard/admin/rentals",
    icon: ClipboardList,
  },
  {
    label: "My Profile",
    href: "/dashboard/admin/profile",
    icon: UserRound,
  },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({
  mobileOpen,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.replace("/signin");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
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
          "fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-white/10 bg-[#14211F] text-[#F4F1E8] transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-7">
          <Link href="/" className="flex items-center gap-3" onClick={onClose}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F07842] text-white">
              <ShieldCheck size={21} />
            </div>

            <div>
              <p className="text-lg font-black tracking-[0.16em]">EQUIPORA</p>
              <p className="text-[9px] tracking-[0.28em] text-[#C9DB83]">
                ADMIN CONSOLE
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

        {/* Workspace */}
        <div className="px-6 pb-3 pt-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
            Workspace
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/dashboard/admin" &&
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
                <span>{item.label}</span>

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#F07842]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-4 rounded-xl bg-white/5 p-4">
            <p className="text-xs font-semibold">Administrator access</p>
            <p className="mt-1 text-[11px] text-white/40">
              Manage your rental platform
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
