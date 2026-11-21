"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ClipboardList, Heart, UserRound, ArrowUpRight } from "lucide-react";

import CustomerPageHeader from "@/components/customer/CustomerPageHeader";
import CustomerTableSkeleton from "@/components/customer/CustomerTableSkeleton";

import { getMyRentals, getMyFavorites, getMyProfile } from "@/lib/api/customer";

export default function CustomerOverviewPage() {
  const [stats, setStats] = useState({
    rentals: 0,
    favorites: 0,
    completed: 0,
    name: "Customer",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [rentalsResult, favoritesResult, profileResult] = await Promise.all(
        [getMyRentals(), getMyFavorites(), getMyProfile()]
      );

      setStats({
        rentals: rentalsResult.count,
        favorites: favoritesResult.count,
        completed: rentalsResult.rentals.filter(
          (rental) => rental.status === "completed"
        ).length,
        name: profileResult.profile.name || "Customer",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadingDashboard = async () => {
      void loadDashboard();
    };

    void loadingDashboard();
  }, []);

  const cards = [
    {
      label: "My rentals",
      value: stats.rentals,
      detail: "Your equipment bookings",
      href: "/dashboard/customer/rentals",
      icon: ClipboardList,
    },
    {
      label: "Saved favorites",
      value: stats.favorites,
      detail: "Equipment you have saved",
      href: "/dashboard/customer/favorites",
      icon: Heart,
    },
    {
      label: "Completed rentals",
      value: stats.completed,
      detail: "Successfully completed bookings",
      href: "/dashboard/customer/rentals",
      icon: UserRound,
    },
  ];

  return (
    <div>
      <CustomerPageHeader
        eyebrow="Customer workspace"
        title="Your rental space."
        description="Manage your bookings, explore saved equipment and keep your account information up to date."
      />

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-white p-5">
          <p className="text-sm font-semibold text-red-600">{error}</p>

          <button
            onClick={() => void loadDashboard()}
            className="mt-3 text-sm font-bold underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <CustomerTableSkeleton rows={4} columns={3} />
      ) : (
        <>
          <div className="mb-7 overflow-hidden rounded-2xl bg-[#14211F] p-7 text-[#F4F1E8] sm:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C9DB83]">
              Welcome to your workspace
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Welcome back, {stats.name}.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">
              Your equipment journey starts here. Keep track of your rentals and
              return to the equipment you love.
            </p>

            <Link
              href="/equipment"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#C9DB83] px-5 py-3 text-sm font-bold text-[#14211F] transition hover:bg-white"
            >
              Explore equipment
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  href={card.href}
                  key={card.label}
                  className="group rounded-2xl border border-[#14211F]/10 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#14211F] text-[#C9DB83]">
                      <Icon size={20} />
                    </div>

                    <ArrowUpRight
                      size={18}
                      className="text-[#14211F]/30 transition group-hover:text-[#F07842]"
                    />
                  </div>

                  <p className="mt-7 text-3xl font-black tabular-nums">
                    {card.value}
                  </p>

                  <p className="mt-1 text-sm font-bold">{card.label}</p>

                  <p className="mt-2 text-xs text-[#14211F]/45">
                    {card.detail}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <Link
              href="/dashboard/customer/rentals"
              className="flex items-center justify-between rounded-2xl border border-[#14211F]/10 bg-white p-6 transition hover:border-[#F07842]/50"
            >
              <div>
                <p className="font-bold">Review your rentals</p>
                <p className="mt-1 text-xs text-[#14211F]/45">
                  Check booking and payment status.
                </p>
              </div>

              <ArrowUpRight size={19} />
            </Link>

            <Link
              href="/dashboard/customer/profile"
              className="flex items-center justify-between rounded-2xl border border-[#14211F]/10 bg-white p-6 transition hover:border-[#F07842]/50"
            >
              <div>
                <p className="font-bold">Update your profile</p>
                <p className="mt-1 text-xs text-[#14211F]/45">
                  Keep your contact information current.
                </p>
              </div>

              <ArrowUpRight size={19} />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
