import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function HomePage() {
  return (
    <section className="relative overflow-hidden bg-[#F5F3ED]">
      <div className="mx-auto grid min-h-[680px] max-w-[1500px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:px-12">
        <div className="relative z-10">
          <p className="inline-flex items-center gap-3 text-[11px] font-bold tracking-[3px] text-[#EF8051]">
            <span className="h-px w-8 bg-[#EF8051]" />
            THE SMARTER WAY TO RENT
          </p>

          <h1 className="mt-8 max-w-2xl text-5xl font-black leading-[1.05] tracking-[-2.5px] text-[#17231F] sm:text-6xl xl:text-7xl">
            Equipment for
            <br />
            every big
            <br />
            <span className="text-[#EF8051]">ambition.</span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-8 text-[#7B857F]">
            Discover professional equipment, connect with trusted owners and
            bring your next project to life.
          </p>

          <Link
            href="/equipment"
            className="group mt-9 inline-flex items-center gap-4 rounded-full bg-[#17231F] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#EF8051]"
          >
            Explore Equipment
            <ArrowUpRight
              size={18}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>

        <div className="relative">
          <div className="absolute -right-5 -top-5 h-40 w-40 rounded-full bg-[#D3E39A]/60 blur-3xl" />

          <div className="relative overflow-hidden rounded-[28px] bg-[#17231F]">
            <img
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85"
              alt="Professional construction equipment"
              className="h-[440px] w-full object-cover opacity-90 sm:h-[540px]"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#17231F] via-[#17231F]/50 to-transparent p-7 pt-24">
              <p className="text-[10px] font-bold tracking-[3px] text-[#D3E39A]">
                BUILT FOR EVERY PROJECT
              </p>

              <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                Find what moves you forward.
              </h2>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-4 rounded-2xl border border-[#17231F]/5 bg-white p-5 shadow-xl sm:-left-8">
            <p className="text-[9px] font-bold tracking-[2px] text-[#89938C]">
              THE EQUIPORA PROMISE
            </p>
            <p className="mt-2 text-sm font-black text-[#17231F]">
              Rent smart. Build more.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
