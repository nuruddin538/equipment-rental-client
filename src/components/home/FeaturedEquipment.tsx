"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Heart,
  PackageOpen,
  RefreshCw,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Equipment } from "@/lib/types/equipment";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const FeaturedEquipment = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedEquipment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/equipment/featured`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Unable to load featured equipment.");
        }
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || "Failed to load equipment.");
        }
        setEquipment(result.equipment || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedEquipment();
  }, []);
  const handleViewDetails = (equipmentId: string) => {
    if (isPending) return;
    if (!session?.user) {
      router.push(
        `/login?callbackURL=${encodeURIComponent(`/equipment/${equipmentId}`)}`
      );
      return;
    }
    router.push(`/equipment/${equipmentId}`);
  };
  const getEquipmentName = (item: Equipment) =>
    item.name || item.title || "Untitled Equipment";

  const getEquipmentImage = (item: Equipment) =>
    item.imageUrl || item.images?.[0] || "/images/equipment-placeholder.png";

  const getEquipmentPrice = (item: Equipment) =>
    item.pricePerDay ?? item.price ?? 0;
  return (
    <section className="relative overflow-hidden bg-[#F5F3ED] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Section Heading */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-[#EF8051]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#EF8051] sm:text-xs">
                Handpicked for your next project
              </span>
            </div>
            <h2 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-[-0.055em] text-[#14211F] sm:text-5xl lg:text-6xl">
              Equipment that
              <br />
              <span className="text-[#EF8051]">gets things done.</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#14211F]/60 sm:text-base">
              Explore our selection of verified equipment. Find the right tools
              and machinery to bring your next big idea to life.
            </p>
          </div>
          <Link
            href="/equipment"
            className="group inline-flex w-fit items-center gap-3 border-b border-[#14211F]/30 pb-2 text-sm font-semibold text-[#14211F] transition-colors hover:border-[#EF8051] hover:text-[#EF8051]"
          >
            Explore all equipment
            <ArrowUpRight
              size={17}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-[#14211F]/10 bg-white"
              >
                <div className="aspect-[4/3] bg-[#E7E5DC]" />
                <div className="space-y-4 p-5">
                  <div className="h-3 w-1/3 rounded bg-[#E7E5DC]" />
                  <div className="h-5 w-3/4 rounded bg-[#E7E5DC]" />
                  <div className="h-4 w-1/2 rounded bg-[#E7E5DC]" />
                  <div className="h-11 rounded-full bg-[#E7E5DC]" />
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#14211F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#263B35]"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        )}
        {/* Empty State */}
        {!loading && !error && equipment.length === 0 && (
          <div className="rounded-2xl border border-[#14211F]/10 bg-white px-6 py-16 text-center">
            <PackageOpen size={35} className="mx-auto text-[#EF8051]" />

            <h3 className="mt-5 text-xl font-bold text-[#14211F]">
              No featured equipment yet
            </h3>

            <p className="mt-2 text-sm text-[#14211F]/55">
              Approved equipment will appear here.
            </p>
          </div>
        )}
        {/* Equipment Grid */}
        {!loading && !error && equipment.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {equipment.map((item, index) => (
              <article
                key={item._id}
                className="group overflow-hidden rounded-2xl border border-[#14211F]/[0.08] bg-white transition-all duration-500 hover:-translate-y-2 hover:border-[#EF8051]/40 hover:shadow-[0_24px_60px_rgba(20,33,31,0.10)]"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#E9E7DE]">
                  <Image
                    src={getEquipmentImage(item)}
                    alt={getEquipmentName(item)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute left-4 top-4">
                    <span className="rounded-full border border-white/30 bg-[#14211F]/80 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                      {item.category || "Equipment"}
                    </span>
                  </div>

                  <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#14211F] backdrop-blur-sm">
                    <Heart size={16} />
                  </div>

                  <div className="absolute bottom-4 left-4">
                    <span className="rounded-full bg-[#C9DB83] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#14211F]">
                      Approved
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-xs text-[#14211F]/50">
                    <MapPin size={14} className="text-[#EF8051]" />
                    <span>{item.location || "Location not specified"}</span>
                  </div>

                  <h3 className="mt-3 line-clamp-1 text-xl font-bold tracking-tight text-[#14211F] transition-colors group-hover:text-[#EF8051]">
                    {getEquipmentName(item)}
                  </h3>

                  <div className="mt-5 flex items-end justify-between border-t border-[#14211F]/10 pt-5">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#14211F]/45">
                        Rental Price
                      </p>

                      <p className="mt-1 text-2xl font-bold tracking-tight text-[#14211F]">
                        ৳{getEquipmentPrice(item).toLocaleString("en-BD")}
                        <span className="ml-1 text-xs font-medium text-[#14211F]/45">
                          / day
                        </span>
                      </p>
                    </div>

                    <span className="text-[10px] font-medium uppercase tracking-wider text-[#14211F]/40">
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <button
                    onClick={() => handleViewDetails(item._id)}
                    disabled={isPending}
                    className="group/button mt-6 flex min-h-12 w-full items-center justify-between rounded-full bg-[#14211F] px-5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#EF8051] disabled:cursor-wait disabled:opacity-60"
                  >
                    <span>View Details</span>

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover/button:rotate-45">
                      <ArrowRight size={17} />
                    </span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        {/* Bottom Link */}
        {!loading && !error && equipment.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/equipment"
              className="inline-flex items-center gap-3 rounded-full border border-[#14211F]/20 px-7 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#14211F] transition-all hover:border-[#14211F] hover:bg-[#14211F] hover:text-white"
            >
              Discover all equipment
              <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedEquipment;
