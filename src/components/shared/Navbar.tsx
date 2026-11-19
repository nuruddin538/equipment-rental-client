"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowUpRight, LogOut, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { authClient, signOut, useSession } from "@/lib/auth-client";
import path from "path";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "All Equipment", href: "/equipment" },
  { name: "About Us", href: "/about" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "Contact", href: "/#contact" },
];

function getDashboardPath(role?: string) {
  if (role === "admin") return "/dashboard/admin/overview";
  if (role === "owner") return "/dashboard/owner/overview";
  return "/dashboard/customer/overview";
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: session, isPending } = useSession();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error(error.message || "Logout failed");
        return;
      }
      toast.success("Logged out successfully!");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoggingOut(false);
    }
  };
  const dashboardPath = getDashboardPath(
    session?.user?.role as string | undefined
  );
  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e5dc] bg-[#f4f1e8]/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14211f] text-xl font-bold text-[#c9db83]">
            E
          </span>
          <span className="text-xl font-bold tracking-tight text-[#14211f]">
            EQUIPORA
            <span className="block text-[9px] font-medium tracking-[0.25em] text-[#f07842]">
              RENT SMART. BUILD MORE.
            </span>
          </span>
        </Link>
        {/* Desktop navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === pathname ||
              (link.href !== "/" && link.href === pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition ${
                  isActive
                    ? "text-[#f07842]"
                    : "text-[#52605b] hover:text-[#14211f]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
        {/* Auth actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-[#e5e1d7]" />
          ) : session ? (
            <>
              <Link
                href={dashboardPath}
                className="flex items-center gap-2 rounded-full border border-[#d8d8ca] px-5 py-2.5 text-sm font-semibold text-[#14211f] transition hover:bg-white"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 rounded-full bg-[#14211f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#f07842] disabled:opacity-60"
              >
                <LogOut size={16} />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2.5 text-sm font-semibold text-[#14211f] hover:text-[#f07842]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-full bg-[#14211f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#f07842]"
              >
                Get Started
                <ArrowUpRight size={16} />
              </Link>
            </>
          )}
        </div>
        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-[#d8d8ca] p-2 text-[#14211f] lg:hidden"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-[#e8e5dc] bg-[#f4f1e8] px-5 py-5 lg:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-[#14211f]"
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-3 border-t border-[#dedace] pt-4">
              {!isPending && session ? (
                <>
                  <Link
                    href={dashboardPath}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full border border-[#14211f] px-5 py-3 text-center text-sm font-semibold"
                  >
                    {" "}
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="rounded-full bg-[#14211f] px-5 py-3 text-sm font-semibold text-white"
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full border border-[#14211f] px-5 py-3 text-center text-sm font-semibold"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full bg-[#14211f] px-5 py-3 text-center text-sm font-semibold text-white"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
