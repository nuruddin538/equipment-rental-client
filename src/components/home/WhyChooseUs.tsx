import {
  BadgeCheck,
  Wallet,
  CalendarDays,
  ShieldCheck,
  ArrowUpRight,
  Check,
} from "lucide-react";
import Link from "next/link";

const benefits = [
  {
    number: "01",
    title: "Affordable",
    highlight: "Rental Prices",
    description:
      "Get the equipment you need without the heavy investment. Pay only for the time you use it.",
    Icon: Wallet,
    detail: "Budget-friendly rates",
  },
  {
    number: "02",
    title: "Verified",
    highlight: "Equipment Owners",
    description:
      "Rent with confidence from trusted equipment owners. We prioritize transparency and reliability.",
    Icon: BadgeCheck,
    detail: "Trust comes first",
  },
  {
    number: "03",
    title: "Flexible",
    highlight: "Rental Periods",
    description:
      "Choose rental durations that fit your project. Whether it’s a day, a week or longer.",
    Icon: CalendarDays,
    detail: "Your schedule, your choice",
  },
  {
    number: "04",
    title: "Secure",
    highlight: "Online Payments",
    description:
      "Enjoy a smooth checkout experience with secure payment processing for every booking.",
    Icon: ShieldCheck,
    detail: "Protected checkout",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-[#14211F] px-5 py-24 text-[#F4F1E8] sm:px-8 lg:px-12 lg:py-32">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full border border-white/[0.06]" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full border border-white/[0.06]" />

      <div className="relative mx-auto max-w-[1440px]">
        {/* Heading */}
        <div className="mb-16 grid gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[#EF8051]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#C9DB83]">
                The EQUIPORA advantage
              </span>
            </div>

            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-5xl lg:text-7xl">
              Better access.
              <br />
              <span className="font-normal text-[#A4ADA2]">
                Better possibilities.
              </span>
            </h2>
          </div>

          <div className="lg:pb-2">
            <p className="max-w-md text-sm leading-7 text-[#A4ADA2]">
              Great projects start with the right equipment. We make renting
              simpler, smarter and more accessible for everyone.
            </p>

            <div className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#C9DB83]">
              <Check size={15} />
              <span>Built around your needs</span>
            </div>
          </div>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 border-l border-t border-white/[0.12] sm:grid-cols-2">
          {benefits.map((benefit) => {
            const Icon = benefit.Icon;

            return (
              <article
                key={benefit.number}
                className="group relative min-h-[300px] border-b border-r border-white/[0.12] p-7 transition-colors duration-500 hover:bg-white/[0.035] sm:p-9 lg:p-11"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs tracking-widest text-[#78877C]">
                    / {benefit.number}
                  </span>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-[#C9DB83] transition-all duration-500 group-hover:rotate-[-8deg] group-hover:border-[#C9DB83]/50 group-hover:bg-[#C9DB83]/10">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                </div>

                <div className="mt-12">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#F4F1E8] sm:text-3xl">
                    {benefit.title}
                    <br />
                    <span className="font-normal text-[#A4ADA2]">
                      {benefit.highlight}
                    </span>
                  </h3>

                  <p className="mt-5 max-w-sm text-sm leading-7 text-[#A4ADA2]">
                    {benefit.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#78877C]">
                    {benefit.detail}
                  </span>

                  <ArrowUpRight
                    size={17}
                    className="text-[#C9DB83] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex flex-col justify-between gap-6 rounded-sm bg-[#C9DB83] p-7 text-[#14211F] sm:flex-row sm:items-center sm:p-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
              Ready when you are
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
              Your next project starts here.
            </h3>
          </div>

          <Link
            href="/equipment"
            className="inline-flex w-fit items-center gap-3 rounded-sm bg-[#14211F] px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#F4F1E8] transition-all duration-300 hover:bg-[#263A32]"
          >
            Explore equipment
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
