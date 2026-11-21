"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Package,
  ClipboardList,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTableSkeleton from "@/components/admin/AdminTableSkeleton";
import { getAllUsers, getAllEquipment, getAllRentals } from "@/lib/api/admin";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    users: 0,
    equipment: 0,
    pending: 0,
    rentals: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");

      const [users, equipment, rentals] = await Promise.all([
        getAllUsers(),
        getAllEquipment(),
        getAllRentals(),
      ]);

      setStats({
        users: users.count,
        equipment: equipment.count,
        pending: equipment.equipment.filter((item) => item.status === "pending")
          .length,
        rentals: rentals.count,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  //   useEffect(() => {
  //     void loadStats();
  //   }, []);
  useEffect(() => {
    const loadStats = async () => {
      void loadStats();
    };

    void loadStats();
  }, []);

  const cards = [
    {
      label: "Registered users",
      value: stats.users,
      icon: Users,
      href: "/dashboard/admin/users",
      detail: "Manage platform accounts",
    },
    {
      label: "Total equipment",
      value: stats.equipment,
      icon: Package,
      href: "/dashboard/admin/equipment",
      detail: "Manage equipment listings",
    },
    {
      label: "Pending approval",
      value: stats.pending,
      icon: ShieldCheck,
      href: "/dashboard/admin/equipment",
      detail: "Review new submissions",
    },
    {
      label: "Rental bookings",
      value: stats.rentals,
      icon: ClipboardList,
      href: "/dashboard/admin/rentals",
      detail: "Monitor rental activity",
    },
  ];

  return (
    <div>
      <AdminPageHeader
        eyebrow="Platform overview"
        title="Command center."
        description="A complete overview of users, equipment listings and rental activity across EQUIPORA."
      />

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-white p-5">
          <p className="text-sm font-semibold text-red-600">{error}</p>
          <button
            onClick={() => void loadStats()}
            className="mt-3 text-sm font-bold underline"
          >
            Retry loading
          </button>
        </div>
      )}

      {loading ? (
        <AdminTableSkeleton rows={4} columns={3} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card, index) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.label}
                  href={card.href}
                  className="group relative overflow-hidden rounded-2xl border border-[#14211F]/10 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#14211F] text-[#C9DB83]">
                      <Icon size={20} />
                    </div>

                    <ArrowUpRight
                      size={18}
                      className="text-[#14211F]/30 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#F07842]"
                    />
                  </div>

                  <p className="mt-7 text-3xl font-black tabular-nums">
                    {card.value.toLocaleString()}
                  </p>

                  <p className="mt-1 text-sm font-bold">{card.label}</p>
                  <p className="mt-2 text-xs text-[#14211F]/45">
                    {card.detail}
                  </p>

                  <div
                    className={`absolute bottom-0 left-0 h-1 w-full ${
                      index === 2 ? "bg-[#F07842]" : "bg-[#C9DB83]"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl bg-[#14211F] p-7 text-[#F4F1E8] sm:p-9">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C9DB83]">
                Administrator workspace
              </p>
              <h2 className="mt-4 max-w-lg text-3xl font-black leading-tight sm:text-4xl">
                Keep the platform moving.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/55">
                Review new equipment submissions, manage user access and monitor
                rental activity from one central workspace.
              </p>
              <Link
                href="/dashboard/admin/equipment"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#C9DB83] px-5 py-3 text-sm font-bold text-[#14211F] transition hover:bg-white"
              >
                Review equipment
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="rounded-2xl border border-[#14211F]/10 bg-white p-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F07842]">
                Quick actions
              </p>

              <div className="mt-5 space-y-3">
                <Link
                  href="/dashboard/admin/users"
                  className="flex items-center justify-between rounded-xl bg-[#F4F1E8] p-4 text-sm font-semibold transition hover:bg-[#C9DB83]/40"
                >
                  Manage users
                  <ArrowUpRight size={17} />
                </Link>

                <Link
                  href="/dashboard/admin/equipment"
                  className="flex items-center justify-between rounded-xl bg-[#F4F1E8] p-4 text-sm font-semibold transition hover:bg-[#C9DB83]/40"
                >
                  Approve equipment
                  <ArrowUpRight size={17} />
                </Link>

                <Link
                  href="/dashboard/admin/rentals"
                  className="flex items-center justify-between rounded-xl bg-[#F4F1E8] p-4 text-sm font-semibold transition hover:bg-[#C9DB83]/40"
                >
                  Monitor rentals
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
