import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "All Equipment", href: "/equipment" },
      { label: "About Us", href: "/about" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Contact Us", href: "/#contact" },
      { label: "Login", href: "/login" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-[#14211f] text-[#f4f1e8]">
      <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-16 md:px-10 md:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-3xl font-black tracking-tight">
              EQUIPORA<span className="text-[#f07842]">.</span>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-8 text-[#a8b4ab]">
              The smarter way to find, rent and manage professional equipment.
              Whatever you are building, start with the right equipment.
            </p>

            <Link
              href="/equipment"
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#c9db83] px-6 py-3.5 text-sm font-bold text-[#14211f] transition hover:bg-[#f07842] hover:text-white"
            >
              Explore Equipment
              <ArrowUpRight size={17} />
            </Link>
          </div>

          {/* Footer links */}
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-[#c9db83]">
                {group.title}
              </h3>

              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#a8b4ab] transition hover:pl-1 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col justify-between gap-6 border-t border-white/10 pt-7 md:flex-row md:items-center">
          <p className="text-xs text-[#8c9b91]">
            © 2026 EQUIPORA. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {[FaFacebookF, FaInstagram, FaLinkedinIn].map((Icon, index) => (
              <a
                key={index}
                href="#"
                aria-label={["Facebook", "Instagram", "LinkedIn"][index]}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[#c9db83] transition hover:border-[#f07842] hover:bg-[#f07842] hover:text-white"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>

          <p className="text-xs font-bold tracking-[0.2em] text-[#c9db83]">
            RENT SMART. BUILD MORE.
          </p>
        </div>
      </div>
    </footer>
  );
}
