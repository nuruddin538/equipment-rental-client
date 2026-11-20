
import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  CarFront,
  Construction,
  Sprout,
  Monitor,
  PartyPopper,
} from "lucide-react";

const categories = [
  {
    number: "01",
    title: "Construction",
    subtitle: "Equipment",
    description: "Power tools, excavators & heavy machinery.",
    count: "Heavy duty",
    href: "/equipment?category=Construction%20Equipment",
    Icon: Construction,
    theme: "bg-[#E8E5D9]",
    iconColor: "text-[#D76D3E]",
  },
  {
    number: "02",
    title: "Photography",
    subtitle: "Equipment",
    description: "Professional cameras, lenses & studio gear.",
    count: "Creative gear",
    href: "/equipment?category=Photography%20Equipment",
    Icon: Camera,
    theme: "bg-[#E5E9E1]",
    iconColor: "text-[#405F50]",
  },
  {
    number: "03",
    title: "Vehicles &",
    subtitle: "Transportation",
    description: "Reliable vehicles for every kind of journey.",
    count: "On the move",
    href: "/equipment?category=Vehicles%20%26%20Transportation",
    Icon: CarFront,
    theme: "bg-[#EAE4DC]",
    iconColor: "text-[#9A6747]",
  },
  {
    number: "04",
    title: "Agriculture",
    subtitle: "Equipment",
    description: "Modern machinery for smarter farming.",
    count: "Farm essentials",
    href: "/equipment?category=Agriculture%20Equipment",
    Icon: Sprout,
    theme: "bg-[#E8EBD9]",
    iconColor: "text-[#627C3D]",
  },
  {
    number: "05",
    title: "Electronics",
    subtitle: "& Technology",
    description: "Essential tech, gadgets & electronic devices.",
    count: "Smart tools",
    href: "/equipment?category=Electronics",
    Icon: Monitor,
    theme: "bg-[#E2E7E9]",
    iconColor: "text-[#486A7A]",
  },
  {
    number: "06",
    title: "Event",
    subtitle: "Equipment",
    description: "Everything you need to bring events to life.",
    count: "Make it happen",
    href: "/equipment?category=Event%20Equipment",
    Icon: PartyPopper,
    theme: "bg-[#ECE4E1]",
    iconColor: "text-[#A65F4A]",
  },
];

export default function CategoriesSection() {
  return (
    <section className="bg-[#F4F1E8] px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        {/* Section heading */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#EF8051]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#68746B]">
                Explore by category
              </span>
            </div>

            <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.055em] text-[#14211F] sm:text-5xl lg:text-6xl">
              Find the right tools.
              <br />
              <span className="font-normal text-[#7B8278]">
                Make things happen.
              </span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-[#70786F]">
            From powerful machinery to creative essentials, discover equipment
            for every project, purpose and possibility.
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.Icon;

            return (
              <Link
                key={category.number}
                href={category.href}
                className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[5px] border border-[#14211F]/[0.07] bg-[#FAF9F5] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#14211F]/20 hover:shadow-[0_18px_45px_rgba(20,33,31,0.09)] sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[11px] tracking-widest text-[#92968D]">
                    / {category.number}
                  </span>

                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-full ${category.theme} transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110`}
                  >
                    <Icon
                      size={25}
                      strokeWidth={1.5}
                      className={category.iconColor}
                    />
                  </span>
                </div>

                <div className="relative z-10 mt-8">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#92968D]">
                    {category.count}
                  </p>

                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h3 className="text-[25px] font-semibold leading-tight tracking-[-0.045em] text-[#14211F] sm:text-[27px]">
                        {category.title}
                      </h3>
                      <p className="mt-1 text-[25px] font-normal leading-tight tracking-[-0.045em] text-[#858A80] sm:text-[27px]">
                        {category.subtitle}
                      </p>
                    </div>

                    <span className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#14211F]/15 text-[#14211F] transition-all duration-300 group-hover:border-[#14211F] group-hover:bg-[#14211F] group-hover:text-[#F4F1E8]">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>

                  <p className="mt-4 max-w-[270px] text-xs leading-6 text-[#858A80]">
                    {category.description}
                  </p>
                </div>

                <div className="absolute -bottom-16 -right-10 h-40 w-40 rounded-full border border-[#14211F]/[0.045] transition-transform duration-700 group-hover:scale-150" />
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-[#14211F]/10 pt-7 sm:flex-row sm:items-center">
          <p className="text-sm text-[#747B72]">
            Can’t find what you’re looking for? Explore our complete collection.
          </p>

          <Link
            href="/equipment"
            className="group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-[#14211F]"
          >
            Browse all equipment
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#14211F] text-[#F4F1E8] transition-transform duration-300 group-hover:translate-x-1">
              <ArrowUpRight size={15} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
