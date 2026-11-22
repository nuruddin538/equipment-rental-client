"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Clock3,
  CheckCircle2,
  CalendarCheck,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";

import { getMyEquipment, getOwnerRentals } from "@/lib/api/owner";
import type { Equipment, OwnerRental } from "@/lib/types/owner";
import OwnerAnalytics from "@/components/owner/OwnerAnalytics";

export default function OwnerDashboardPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [rentals, setRentals] = useState<OwnerRental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadDashboardData = async () => {
      try {
        const [equipmentResponse, rentalsResponse] = await Promise.all([
          getMyEquipment(),
          getOwnerRentals(),
        ]);

        if (!active) return;

        if (Array.isArray(equipmentResponse?.equipment)) {
          setEquipment(equipmentResponse.equipment);
        }

        if (Array.isArray(rentalsResponse?.rentals)) {
          setRentals(rentalsResponse.rentals);
        }
      } catch (error) {
        if (!active) return;

        console.error("Owner dashboard error:", error);
        toast.error("Failed to load dashboard data.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      active = false;
    };
  }, []);

  const totalEquipment = equipment.length;

  const pendingEquipment = equipment.filter(
    (item) => item.status?.toLowerCase() === "pending"
  ).length;

  const approvedEquipment = equipment.filter(
    (item) => item.status?.toLowerCase() === "approved"
  ).length;

  const totalRentals = rentals.length;

  const stats = [
    {
      title: "Total Equipment",
      value: totalEquipment,
      icon: Package,
      description: "Your listed equipment",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Pending Approval",
      value: pendingEquipment,
      icon: Clock3,
      description: "Waiting for admin approval",
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Approved Listings",
      value: approvedEquipment,
      icon: CheckCircle2,
      description: "Active equipment listings",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Total Rentals",
      value: totalRentals,
      icon: CalendarCheck,
      description: "Rental booking requests",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen space-y-10 bg-[#FAF9F5] p-4 sm:p-6 lg:p-8">
      {/* Dashboard Header */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F07842]">
            OWNER DASHBOARD
          </p>

          <h1 className="mt-2 text-2xl font-black text-[#14211F] sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-[#14211F]/55">
            Manage your equipment, track rentals and monitor your business
            performance.
          </p>
        </div>

        <Link
          href="/dashboard/owner/add-equipment"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173F35] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#102F28]"
        >
          <Plus size={18} />
          Add Equipment
        </Link>
      </section>

      {/* Overview Statistics */}
      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-black text-[#14211F]">
            Overview Statistics
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            A quick overview of your rental business.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon size={22} />
                  </div>

                  <ArrowUpRight size={19} className="text-gray-300" />
                </div>

                <p className="mt-5 text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <h3 className="mt-1 text-3xl font-black text-[#14211F]">
                  {loading
                    ? "..."
                    : Number(stat.value ?? 0).toLocaleString("en-US")}
                </h3>

                <p className="mt-2 text-xs text-gray-400">{stat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Owner Analytics */}
      <section className="space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F07842]">
            BUSINESS PERFORMANCE
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#14211F]">
            Analytics Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Track your rental earnings, completed rentals and monthly business
            performance.
          </p>
        </div>

        <OwnerAnalytics />
      </section>

      {/* Recent Equipment & Rentals */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Recent Equipment */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-[#14211F]">
                Recent Equipment
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                Your recently listed equipment
              </p>
            </div>

            <Link
              href="/dashboard/owner/my-equipment"
              className="text-sm font-bold text-[#F07842] hover:underline"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-gray-400">
              Loading equipment...
            </p>
          ) : equipment.length === 0 ? (
            <div className="py-8 text-center">
              <Package size={32} className="mx-auto text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                No equipment listed yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {equipment.slice(0, 5).map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                        <Package size={20} className="text-gray-400" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-[#14211F]">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        {item.category}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-600">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Rentals */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-[#14211F]">
                Recent Rentals
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                Latest rental booking activities
              </p>
            </div>

            <Link
              href="/dashboard/owner/rentals"
              className="text-sm font-bold text-[#F07842] hover:underline"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-gray-400">
              Loading rentals...
            </p>
          ) : rentals.length === 0 ? (
            <div className="py-8 text-center">
              <CalendarCheck size={32} className="mx-auto text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                No rental bookings yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {rentals.slice(0, 5).map((rental) => (
                <div
                  key={rental._id}
                  className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-[#14211F]">
                      {rental.equipmentName}
                    </h3>

                    <p className="mt-1 truncate text-xs text-gray-400">
                      {rental.customerName}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-600">
                    {rental.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Business Growth */}
      <section className="rounded-2xl bg-[#173F35] p-6 text-white sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F6A77F]">
              GROW YOUR BUSINESS
            </p>

            <h2 className="mt-3 text-2xl font-black">
              Ready to grow your rental business?
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
              Add more equipment, manage your listings and monitor your earnings
              from one place.
            </p>
          </div>

          <Link
            href="/dashboard/owner/add-equipment"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#173F35] transition hover:bg-gray-100"
          >
            <Plus size={18} />
            Add New Equipment
          </Link>
        </div>
      </section>
    </div>
  );
}
