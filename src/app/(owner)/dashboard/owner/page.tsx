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
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";

import { getMyEquipment, getOwnerRentals } from "@/lib/api/owner";

import type { Equipment, OwnerRental } from "@/lib/types/owner";

export default function OwnerDashboardPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [rentals, setRentals] = useState<OwnerRental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [equipmentResult, rentalResult] = await Promise.all([
          getMyEquipment(),
          getOwnerRentals(),
        ]);

        setEquipment(equipmentResult.equipment || []);
        setRentals(rentalResult.rentals || []);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };
    void loadDashboard();
  }, []);

  const stats = [
    {
      label: "Total Equipment",
      value: equipment.length,
      icon: Package,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Pending Approval",
      value: equipment.filter((item) => item.status === "pending").length,
      icon: Clock3,
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "Approved Listings",
      value: equipment.filter((item) => item.status === "approved").length,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Total Rentals",
      value: rentals.length,
      icon: CalendarCheck,
      color: "bg-orange-50 text-orange-700",
    },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F07842]">
            EQUIPORA / OWNER WORKSPACE
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-[#14211F] sm:text-4xl">
            Business Overview
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Your equipment business, all in one place.
          </p>
        </div>

        <Link
          href="/dashboard/owner/add-equipment"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F07842] px-5 py-3 text-sm font-black text-[#14211F] transition hover:bg-[#e96935]"
        >
          <Plus size={18} />
          Add Equipment
        </Link>
      </header>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="h-32 animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#14211F]/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon size={21} />
                  </div>

                  <ArrowUpRight size={18} className="text-gray-400" />
                </div>

                <p className="mt-5 text-sm font-medium text-gray-500">
                  {stat.label}
                </p>

                <p className="mt-1 text-3xl font-black text-[#14211F]">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Recent equipment */}
        <section className="overflow-hidden rounded-2xl border border-[#14211F]/10 bg-white">
          <div className="flex items-center justify-between border-b border-[#14211F]/10 p-5">
            <div>
              <h2 className="font-black text-[#14211F]">Recent Equipment</h2>
              <p className="mt-1 text-xs text-gray-500">Your latest listings</p>
            </div>

            <Link
              href="/dashboard/owner/my-equipment"
              className="text-xs font-bold text-[#F07842] hover:underline"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-gray-100"
                />
              ))}
            </div>
          ) : equipment.length === 0 ? (
            <div className="p-10 text-center">
              <Package className="mx-auto text-[#F07842]" size={30} />
              <p className="mt-3 text-sm font-bold text-[#14211F]">
                No equipment listed yet
              </p>
              <Link
                href="/dashboard/owner/add-equipment"
                className="mt-3 inline-block text-sm font-bold text-[#F07842]"
              >
                Create your first listing
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#14211F]/10">
              {equipment.slice(0, 5).map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 px-5 py-4"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-12 w-12 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#14211F]">
                      {item.name}
                    </p>
                    <p className="mt-1 truncate text-xs text-gray-500">
                      {item.category}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#F4F1E8] px-3 py-1 text-xs font-bold capitalize text-[#14211F]">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent rentals */}
        <section className="overflow-hidden rounded-2xl border border-[#14211F]/10 bg-white">
          <div className="flex items-center justify-between border-b border-[#14211F]/10 p-5">
            <div>
              <h2 className="font-black text-[#14211F]">Recent Rentals</h2>
              <p className="mt-1 text-xs text-gray-500">
                Latest customer activity
              </p>
            </div>

            <Link
              href="/dashboard/owner/my-rentals"
              className="text-xs font-bold text-[#F07842] hover:underline"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-gray-100"
                />
              ))}
            </div>
          ) : rentals.length === 0 ? (
            <div className="p-10 text-center">
              <CalendarCheck className="mx-auto text-[#F07842]" size={30} />
              <p className="mt-3 text-sm font-bold text-[#14211F]">
                No rental activity yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#14211F]/10">
              {rentals.slice(0, 5).map((rental) => (
                <div
                  key={rental._id}
                  className="flex items-center gap-3 px-5 py-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4F1E8] text-[#F07842]">
                    <CalendarCheck size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#14211F]">
                      {rental.customerName}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {rental.equipmentName}
                    </p>
                  </div>

                  <span className="text-xs font-bold capitalize text-[#14211F]">
                    {rental.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="rounded-2xl bg-[#14211F] p-6 text-[#F4F1E8] sm:p-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9DB83]">
            GROW YOUR BUSINESS
          </p>

          <h2 className="mt-3 text-2xl font-black sm:text-3xl">
            Better equipment listings. Better rental opportunities.
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#B6C2BB]">
            Keep your inventory updated, use accurate photos and provide clear
            rental conditions to build customer trust.
          </p>

          <Link
            href="/dashboard/owner/add-equipment"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F07842] px-5 py-3 text-sm font-black text-[#14211F] hover:bg-[#e96935]"
          >
            List New Equipment
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}
