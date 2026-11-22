"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  Store,
  TrendingUp,
  ClipboardCheck,
  ArrowUpRight,
  Check,
} from "lucide-react";
import Link from "next/link";

const ownerBenefits = [
  {
    title: "Your equipment,",
    highlight: "your business.",
    description:
      "Create equipment listings and showcase your rental inventory to potential customers.",
    Icon: Store,
  },
  {
    title: "Build customer",
    highlight: "confidence.",
    description:
      "Provide accurate equipment details, pricing and availability to help customers book confidently.",
    Icon: ShieldCheck,
  },
  {
    title: "Manage rentals",
    highlight: "with ease.",
    description:
      "Keep track of equipment, booking requests and rental activity from your owner dashboard.",
    Icon: ClipboardCheck,
  },
  {
    title: "Grow your",
    highlight: "opportunities.",
    description:
      "Make your available equipment discoverable to customers looking for rental solutions.",
    Icon: TrendingUp,
  },
];

export default function TrustedOwners() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#14211F] px-5 py-24 text-[#F4F1E8] sm:px-8 lg:px-12 lg:py-32"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-36 top-10 h-[450px] w-[450px] rounded-full border border-white/[0.06]" />
      <div className="pointer-events-none absolute -right-20 top-28 h-[300px] w-[300px] rounded-full border border-white/[0.06]" />

      <div className="relative mx-auto max-w-[1440px]">
        {/* Heading */}
        <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[#EF8051]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#C9DB83]">
                For equipment owners
              </span>
            </div>

            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-5xl lg:text-7xl">
              Turn idle equipment
              <br />
              <span className="font-normal text-[#A4ADA2]">
                into opportunity.
              </span>
            </h2>
          </div>

          <div className="lg:pb-2">
            <p className="max-w-md text-sm leading-7 text-[#A4ADA2]">
              Your equipment can do more than sit in storage. List your
              inventory on EQUIPORA and connect with customers who need it.
            </p>

            <Link
              href="/register"
              className="mt-6 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-[#C9DB83] transition-colors hover:text-white"
            >
              Become an equipment owner
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-16 grid grid-cols-1 border-l border-t border-white/[0.12] sm:grid-cols-2 lg:grid-cols-4">
          {ownerBenefits.map((benefit, index) => {
            const Icon = benefit.Icon;

            return (
              <motion.article
                key={benefit.title}
                initial={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: shouldReduceMotion ? 0.2 : 0.65,
                  delay: shouldReduceMotion ? 0 : index * 0.12,
                }}
                className="group min-h-[300px] border-b border-r border-white/[0.12] p-7 transition-colors duration-500 hover:bg-white/[0.035] sm:p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-[#C9DB83] transition-all duration-500 group-hover:border-[#C9DB83]/50 group-hover:bg-[#C9DB83]/10">
                  <Icon size={22} strokeWidth={1.5} />
                </div>

                <h3 className="mt-10 text-2xl font-semibold leading-tight tracking-[-0.04em]">
                  {benefit.title}
                  <br />
                  <span className="font-normal text-[#A4ADA2]">
                    {benefit.highlight}
                  </span>
                </h3>

                <p className="mt-5 text-sm leading-7 text-[#A4ADA2]">
                  {benefit.description}
                </p>

                <div className="mt-7 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#C9DB83]">
                  <Check size={13} />
                  <span>Owner focused</span>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-[#A4ADA2]">
            Have equipment ready to rent? Start building your rental business.
          </p>

          <Link
            href="/register"
            className="inline-flex items-center gap-3 bg-[#C9DB83] px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#14211F] transition-colors hover:bg-[#DCE9AC]"
          >
            Get started
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
