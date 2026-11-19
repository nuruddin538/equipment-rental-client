"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "All Equipment", href: "/equipment" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "How It Works", href: "/#how-it-works" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error(error.message || "Logout failed");
      return;
    }

    toast.success("Logged out successfully!");
    router.replace("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#14211F]/10 bg-[#F4F1E8]/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-[78px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#14211F] text-lg font-black text-[#C9DB83]">
            E
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight text-[#14211F]">
              EQUIPORA
            </h1>
            <p className="text-[9px] font-bold tracking-[0.2em] text-[#F07842]">
              RENT SMART. BUILD MORE.
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" &&
                link.href !== "/#how-it-works" &&
                pathname.startsWith(link.href));

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition ${
                  active
                    ? "text-[#F07842]"
                    : "text-[#52615C] hover:text-[#14211F]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Authentication */}
        <div className="hidden items-center gap-3 lg:flex">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-gray-200" />
          ) : session ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-full bg-[#C9DB83] px-5 py-2.5 text-sm font-bold text-[#14211F] hover:bg-[#B8CD70]"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full border border-[#14211F]/20 px-4 py-2.5 text-sm font-semibold hover:bg-[#14211F] hover:text-white"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold text-[#14211F]">
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-[#14211F] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#F07842]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-[#14211F]/15 p-2 lg:hidden"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-[#14211F]/10 bg-[#F4F1E8] px-5 py-5 lg:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-[#14211F]"
              >
                {link.name}
              </Link>
            ))}

            {!isPending &&
              (session ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg bg-[#C9DB83] p-3 text-center font-bold text-[#14211F]"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="rounded-lg bg-[#14211F] p-3 text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg border border-[#14211F]/20 p-3 text-center font-bold"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg bg-[#14211F] p-3 text-center font-bold text-white"
                  >
                    Register
                  </Link>
                </>
              ))}
          </div>
        </div>
      )}
    </header>
  );
}
