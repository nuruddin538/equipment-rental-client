"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const links = [
  { label: "Home", href: "/" },
  { label: "Equipment", href: "/equipment" },
  { label: "About", href: "/about" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Unable to logout");
        return;
      }

      toast.success("You have been logged out.");
      setMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong during logout.");
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#17231F]/10 bg-[#F5F3ED]/90 backdrop-blur-2xl">
      <div className="mx-auto flex h-[82px] max-w-[1500px] items-center justify-between px-5 sm:px-8 xl:px-12">
        {/* Brand */}
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-[#17231F] transition duration-300 group-hover:rotate-[-5deg]">
            <span className="text-2xl font-black tracking-tighter text-[#D3E39A]">
              E
            </span>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-[#EF8051]" />
          </div>

          <div className="leading-none">
            <span className="block text-[21px] font-black tracking-[-1.2px] text-[#17231F]">
              EQUIPORA<span className="text-[#EF8051]">.</span>
            </span>
            <span className="mt-1.5 block text-[8px] font-bold tracking-[2.5px] text-[#758079]">
              RENT SMART. BUILD MORE.
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden items-center gap-1 xl:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative rounded-full px-4 py-2.5 text-[13px] font-semibold transition duration-200 ${
                isActive(link.href)
                  ? "bg-[#17231F] text-white"
                  : "text-[#68736D] hover:bg-[#17231F]/5 hover:text-[#17231F]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 xl:flex">
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-[#17231F]/10" />
          ) : session ? (
            <>
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 rounded-full bg-[#D3E39A] px-5 py-3 text-[13px] font-bold text-[#17231F] transition hover:bg-[#C4D786]"
              >
                Dashboard
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-full border border-[#17231F]/15 px-4 py-3 text-[13px] font-bold text-[#17231F] transition hover:border-[#EF8051] hover:text-[#EF8051] disabled:opacity-50"
              >
                {loggingOut ? "Signing out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-3 text-[13px] font-bold text-[#17231F] transition hover:text-[#EF8051]"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="group flex items-center gap-2 rounded-full bg-[#17231F] px-5 py-3 text-[13px] font-bold text-white transition hover:bg-[#EF8051]"
              >
                Get Started
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#17231F]/15 text-[#17231F] xl:hidden"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-[#17231F]/10 bg-[#F5F3ED] px-5 pb-6 pt-4 xl:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link, index) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                  isActive(link.href)
                    ? "bg-[#17231F] text-white"
                    : "text-[#53615A] hover:bg-[#17231F]/5"
                }`}
              >
                {link.label}
                <span className="text-xs text-current/50">0{index + 1}</span>
              </Link>
            ))}
          </nav>

          {!isPending && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl bg-[#D3E39A] px-4 py-3.5 text-center text-sm font-bold text-[#17231F]"
                  >
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="rounded-xl bg-[#17231F] px-4 py-3.5 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {loggingOut ? "Signing out..." : "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl border border-[#17231F]/20 px-4 py-3.5 text-center text-sm font-bold text-[#17231F]"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl bg-[#17231F] px-4 py-3.5 text-center text-sm font-bold text-white"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
