"use client";

import { useCallback, useEffect, useState } from "react";
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
import AdminAnalytics from "@/components/admin/AdminAnalytics";

interface DashboardStats {
  users: number;
  equipment: number;
  pending: number;
  rentals: number;
}

interface EquipmentItem {
  status?: string;
}

interface UsersResponse {
  count?: unknown;
  users?: unknown;
}

interface EquipmentResponse {
  count?: unknown;
  equipment?: unknown;
  equipments?: unknown;
}

interface RentalsResponse {
  count?: unknown;
  rentals?: unknown;
}

const INITIAL_STATS: DashboardStats = {
  users: 0,
  equipment: 0,
  pending: 0,
  rentals: 0,
};

function getSafeCount(count: unknown, items: unknown): number {
  if (count !== undefined && count !== null) {
    const parsedCount = Number(count);

    if (Number.isFinite(parsedCount)) {
      return Math.max(0, parsedCount);
    }
  }

  return Array.isArray(items) ? items.length : 0;
}

function getEquipmentList(data: EquipmentResponse): EquipmentItem[] {
  if (Array.isArray(data.equipment)) {
    return data.equipment as EquipmentItem[];
  }

  if (Array.isArray(data.equipments)) {
    return data.equipments as EquipmentItem[];
  }

  return [];
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const loadStats = useCallback(async (signal?: AbortSignal) => {
    const [usersResult, equipmentResult, rentalsResult] = await Promise.all([
      getAllUsers(),
      getAllEquipment(),
      getAllRentals(),
    ]);

    if (signal?.aborted) return;

    const usersData = usersResult as UsersResponse;
    const equipmentData = equipmentResult as EquipmentResponse;
    const rentalsData = rentalsResult as RentalsResponse;

    const equipmentList = getEquipmentList(equipmentData);

    const pendingCount = equipmentList.filter(
      (item) => item?.status === "pending"
    ).length;

    setStats({
      users: getSafeCount(usersData.count, usersData.users),
      equipment: getSafeCount(equipmentData.count, equipmentList),
      pending: pendingCount,
      rentals: getSafeCount(rentalsData.count, rentalsData.rentals),
    });

    setError("");
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const fetchStats = async () => {
      try {
        await loadStats(controller.signal);
      } catch (err) {
        if (!active || controller.signal.aborted) return;

        console.error("Admin dashboard error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard statistics."
        );
      } finally {
        if (active && !controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchStats();

    return () => {
      active = false;
      controller.abort();
    };
  }, [loadStats, retryCount]);

  const handleRetry = () => {
    setLoading(true);
    setError("");
    setRetryCount((previous) => previous + 1);
  };

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
            onClick={handleRetry}
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
                    {Number(card.value ?? 0).toLocaleString("en-US")}
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

          {/* Admin Analytics */}
          <section className="mt-10 space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F07842]">
                Platform Performance
              </p>

              <h2 className="mt-2 text-2xl font-black text-[#14211F]">
                Analytics Overview
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#14211F]/55">
                Monitor platform revenue, completed rentals and monthly booking
                performance.
              </p>
            </div>

            <AdminAnalytics />
          </section>

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
