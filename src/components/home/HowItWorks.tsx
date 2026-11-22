"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Search,
  CalendarCheck,
  CreditCard,
  ArrowUpRight,
  MoveRight,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Find your",
    highlight: "equipment",
    description:
      "Explore a wide range of equipment. Search by category, location and rental price to find the right match.",
    Icon: Search,
    label: "Discover",
  },
  {
    number: "02",
    title: "Book your",
    highlight: "rental",
    description:
      "Choose your rental dates, enter the required details and send your booking request with ease.",
    Icon: CalendarCheck,
    label: "Reserve",
  },
  {
    number: "03",
    title: "Pay & get",
    highlight: "started",
    description:
      "Complete your payment securely and coordinate with the equipment owner for your rental.",
    Icon: CreditCard,
    label: "Get moving",
  },
];

export default function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="how-it-works"
      className="overflow-hidden scroll-mt-24 bg-[#F4F1E8] px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Heading */}
        <div className="mb-16 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[#EF8051]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#788077]">
                Simple by design
              </span>
            </div>

            <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.055em] text-[#14211F] sm:text-5xl lg:text-7xl">
              Three steps.
              <br />
              <span className="font-normal text-[#858A80]">
                One smart move.
              </span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-[#7B8278] lg:pb-2">
            Renting equipment should be simple. EQUIPORA brings discovery,
            booking and payments together in one convenient place.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.Icon;

            return (
              <motion.article
                key={step.number}
                initial={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 35 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: shouldReduceMotion ? 0.2 : 0.65,
                  delay: shouldReduceMotion ? 0 : index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative flex min-h-[350px] flex-col justify-between overflow-hidden border border-[#14211F]/10 bg-[#FAF9F5] p-7 transition-colors duration-500 hover:bg-white sm:p-9"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs tracking-widest text-[#92968D]">
                    / {step.number}
                  </span>

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8EBD9] text-[#405F50] transition-all duration-500 group-hover:rotate-[-8deg] group-hover:bg-[#C9DB83]">
                    <Icon size={25} strokeWidth={1.5} />
                  </div>
                </div>

                <div className="mt-12">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#EF8051]">
                    {step.label}
                  </p>

                  <h3 className="text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#14211F]">
                    {step.title}
                    <br />
                    <span className="font-normal text-[#858A80]">
                      {step.highlight}
                    </span>
                  </h3>

                  <p className="mt-5 max-w-sm text-sm leading-7 text-[#7B8278]">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-[#14211F]/10 pt-5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#92968D]">
                    Step {step.number}
                  </span>

                  {index !== steps.length - 1 && (
                    <MoveRight
                      size={18}
                      className="text-[#14211F]/40 transition-transform duration-300 group-hover:translate-x-2 group-hover:text-[#EF8051]"
                    />
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <p className="text-sm text-[#7B8278]">
            Ready to find the equipment your project needs?
          </p>

          <Link
            href="/equipment"
            className="inline-flex items-center gap-3 bg-[#14211F] px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#F4F1E8] transition-colors hover:bg-[#344A3F]"
          >
            Explore equipment
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
