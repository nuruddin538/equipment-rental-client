import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  MoveUpRight,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F5F3ED]">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full border border-[#14211F]/[0.06]" />
      <div className="pointer-events-none absolute -left-28 top-32 h-72 w-72 rounded-full border border-[#14211F]/[0.06]" />

      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-12 sm:px-8 sm:pt-16 lg:px-12 lg:pb-16 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
          {/* Left Content */}
          <div className="relative z-10">
            {/* Eyebrow */}
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#14211F]/10 bg-white/60 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#EF8051] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#EF8051]" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211F] sm:text-xs">
                Equipment Rental, Reimagined
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="max-w-[700px] font-[family-name:var(--font-geist-sans)] text-[clamp(3.4rem,7vw,6.5rem)] font-bold leading-[0.98] tracking-[-0.075em] text-[#14211F]">
              Rent Smart.
              <br />
              <span className="relative inline-block text-[#EF8051]">
                Build More.
                <svg
                  className="absolute -bottom-2 left-1 h-3 w-[95%]"
                  viewBox="0 0 300 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9C75 2 190 1 298 7"
                    stroke="#C9DB83"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="mt-8 max-w-[480px] text-base leading-8 text-[#14211F]/65 sm:text-lg">
              From heavy machinery to everyday tools, find the right equipment
              for every project. Discover, rent, and get to work — all in one
              place.
            </p>

            {/* CTA Buttons */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/equipment"
                className="group inline-flex min-h-14 items-center justify-center gap-4 rounded-full bg-[#14211F] px-7 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#263B35] hover:shadow-xl"
              >
                Explore Equipment
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9DB83] text-[#14211F] transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={18} />
                </span>
              </Link>

              <Link
                href="/register"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-[#14211F]/20 px-7 text-sm font-semibold text-[#14211F] transition-all duration-300 hover:border-[#14211F] hover:bg-white"
              >
                Become an Owner
                <MoveUpRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </div>

            {/* Trust Points */}
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#14211F]/10 pt-7">
              <div className="flex items-center gap-2 text-xs font-medium text-[#14211F]/70">
                <CheckCircle2 size={16} className="text-[#6D8A48]" />
                Verified Equipment
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-[#14211F]/70">
                <CheckCircle2 size={16} className="text-[#6D8A48]" />
                Secure Booking
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-[#14211F]/70">
                <CheckCircle2 size={16} className="text-[#6D8A48]" />
                Flexible Rentals
              </div>
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="relative mx-auto w-full max-w-[650px] lg:ml-auto">
            {/* Image Container */}
            <div className="relative aspect-[4/4.3] overflow-hidden rounded-[2rem] bg-[#263B35] sm:aspect-[5/4] lg:aspect-[4/4.5]">
              <div
                role="img"
                aria-label="Construction machinery working at a large construction site"
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=85')",
                }}
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#14211F]/80 via-[#14211F]/10 to-transparent" />

              {/* Top Label */}
              <div className="absolute left-5 top-5 sm:left-7 sm:top-7">
                <span className="rounded-full border border-white/30 bg-black/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                  Built for Every Project
                </span>
              </div>

              {/* Image Bottom Content */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C9DB83]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C9DB83]">
                    Your Next Project Starts Here
                  </span>
                </div>

                <h2 className="max-w-md text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                  The right tools.
                  <br />
                  The right move.
                </h2>

                <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-5">
                  <span className="text-xs text-white/70">
                    Discover equipment that works for you.
                  </span>

                  <Link
                    href="/equipment"
                    aria-label="Browse equipment"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C9DB83] text-[#14211F] transition-transform hover:rotate-45"
                  >
                    <ArrowUpRight size={21} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Floating Equipment Badge */}
            <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl border border-[#14211F]/5 bg-white p-4 shadow-[0_15px_50px_rgba(20,33,31,0.12)] sm:-left-8 sm:bottom-10 sm:p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF0D9]">
                <CheckCircle2 size={22} className="text-[#526E36]" />
              </div>

              <div>
                <p className="text-sm font-bold text-[#14211F]">
                  Rent with Confidence
                </p>
                <p className="mt-1 text-[10px] text-[#14211F]/55">
                  A smarter way to access equipment
                </p>
              </div>
            </div>

            {/* Decorative lime circle */}
            <div className="absolute -right-4 -top-5 -z-0 h-20 w-20 rounded-full bg-[#C9DB83] sm:-right-7 sm:-top-7 sm:h-28 sm:w-28" />
          </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="mt-20 hidden items-center justify-between border-t border-[#14211F]/10 pt-6 md:flex">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#14211F]/40">
            EQUIPORA — RENT SMART. BUILD MORE.
          </p>

          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#14211F]/50">
            Scroll to explore
            <ArrowDown size={15} />
          </div>

          <p className="text-[10px] font-medium tracking-wider text-[#14211F]/40">
            EQUIPMENT ACCESS, SIMPLIFIED.
          </p>
        </div>
      </div>
    </section>
  );
}
