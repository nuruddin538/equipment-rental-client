"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, ClipboardList } from "lucide-react";

import { toast } from "sonner";

import CustomerTableSkeleton from "./CustomerTableSkeleton";
import { getMyRentals } from "@/lib/api/customer";

import type { CustomerRental } from "@/lib/types/customer";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  active: "bg-emerald-100 text-emerald-700",
  completed: "bg-[#14211F]/10 text-[#14211F]",
  cancelled: "bg-red-100 text-red-700",
  rejected: "bg-red-100 text-red-700",
};

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function MyRentalsTable() {
  const [rentals, setRentals] = useState<CustomerRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadRentals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getMyRentals();
      setRentals(result.rentals || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load rentals");
    } finally {
      setLoading(false);
    }
  }, []);

  //   useEffect(() => {
  //     void loadRentals();
  //   }, [loadRentals]);

  useEffect(() => {
    const loadingRentals = async () => {
      void loadRentals();
    };

    void loadingRentals();
  }, [loadRentals]);

  const filteredRentals = useMemo(() => {
    const term = search.toLowerCase();

    return rentals.filter((rental) => {
      return (
        rental.equipmentName?.toLowerCase().includes(term) ||
        rental.paymentStatus?.toLowerCase().includes(term) ||
        rental.status?.toLowerCase().includes(term)
      );
    });
  }, [rentals, search]);

  if (loading) {
    return <CustomerTableSkeleton rows={7} columns={7} />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
        <p className="font-semibold text-red-600">{error}</p>

        <button
          onClick={() => void loadRentals()}
          className="mt-4 rounded-xl bg-[#14211F] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#14211F]/10 bg-white">
      <div className="flex flex-col gap-4 border-b border-[#14211F]/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold">Your rental history</p>
          <p className="mt-1 text-xs text-[#14211F]/45">
            {filteredRentals.length} booking records
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#14211F]/40"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search rental"
              className="h-10 w-full rounded-xl border border-[#14211F]/10 pl-9 pr-3 text-sm outline-none focus:border-[#F07842] sm:w-56"
            />
          </div>

          <button
            onClick={() => void loadRentals()}
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#14211F] px-4 text-sm font-semibold text-white"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>
      </div>

      {filteredRentals.length === 0 ? (
        <div className="px-5 py-16 text-center">
          <ClipboardList size={36} className="mx-auto text-[#14211F]/25" />

          <p className="mt-3 font-semibold">No rentals found</p>

          <p className="mt-1 text-sm text-[#14211F]/45">
            Your equipment booking history will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto xl:block">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-[#F4F1E8]/70 text-[10px] uppercase tracking-wider text-[#14211F]/50">
                <tr>
                  <th className="px-5 py-4">Equipment</th>
                  <th className="px-5 py-4">Start date</th>
                  <th className="px-5 py-4">End date</th>
                  <th className="px-5 py-4">Booking date</th>
                  <th className="px-5 py-4">Total amount</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Booking status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#14211F]/8">
                {filteredRentals.map((rental) => (
                  <tr
                    key={rental._id}
                    className="transition hover:bg-[#F4F1E8]/35"
                  >
                    <td className="px-5 py-4 font-semibold">
                      {rental.equipmentName || "Equipment"}
                    </td>

                    <td className="px-5 py-4 text-[#14211F]/60">
                      {formatDate(rental.startDate)}
                    </td>

                    <td className="px-5 py-4 text-[#14211F]/60">
                      {formatDate(rental.endDate)}
                    </td>

                    <td className="px-5 py-4 text-[#14211F]/60">
                      {formatDate(rental.createdAt)}
                    </td>

                    <td className="px-5 py-4 font-bold">
                      {rental.currency || "BDT"}{" "}
                      {Number(rental.totalAmount || 0).toLocaleString()}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#F4F1E8] px-3 py-1.5 text-[10px] font-bold capitalize">
                        {rental.paymentStatus || "unknown"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-[10px] font-bold capitalize ${
                          statusColors[rental.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {rental.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-[#14211F]/10 xl:hidden">
            {filteredRentals.map((rental) => (
              <article key={rental._id} className="space-y-4 p-5">
                <div>
                  <p className="font-bold">
                    {rental.equipmentName || "Equipment"}
                  </p>

                  <p className="mt-1 text-xs text-[#14211F]/45">
                    Booking date: {formatDate(rental.createdAt)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-[#14211F]/40">Start date</p>
                    <p className="mt-1 font-semibold">
                      {formatDate(rental.startDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[#14211F]/40">End date</p>
                    <p className="mt-1 font-semibold">
                      {formatDate(rental.endDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[#14211F]/40">Total amount</p>
                    <p className="mt-1 font-bold">
                      {rental.currency || "BDT"}{" "}
                      {Number(rental.totalAmount || 0).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-[#14211F]/40">Payment status</p>
                    <p className="mt-1 font-semibold capitalize">
                      {rental.paymentStatus || "unknown"}
                    </p>
                  </div>
                </div>

                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold capitalize ${
                      statusColors[rental.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {rental.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
