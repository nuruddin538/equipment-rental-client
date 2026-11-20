"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Search, RefreshCw, ClipboardList } from "lucide-react";
import { toast } from "sonner";

import { getOwnerRentals } from "@/lib/api/owner";
import type { OwnerRental } from "@/lib/types/owner";

function PaymentBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: "bg-emerald-100 text-emerald-700",
    unpaid: "bg-amber-100 text-amber-700",
    failed: "bg-red-100 text-red-700",
    expired: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function BookingBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export default function RentalTable() {
  const [rentals, setRentals] = useState<OwnerRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const result = await getOwnerRentals();
      setRentals(result.rentals || []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load rentals."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadEquipment = async () => {
      await fetchRentals();
    };

    void loadEquipment();
  }, []);

  const filteredRentals = rentals.filter((rental) => {
    const searchText = search.toLowerCase();

    return (
      rental.customerName?.toLowerCase().includes(searchText) ||
      rental.customerEmail?.toLowerCase().includes(searchText) ||
      rental.equipmentName?.toLowerCase().includes(searchText)
    );
  });

  return (
    <section className="overflow-hidden rounded-2xl border border-[#14211F]/10 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-[#14211F]/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg font-black text-[#14211F]">Rental bookings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Review customer bookings and payment information.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rentals..."
              className="w-full rounded-xl border border-[#14211F]/15 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#F07842] sm:w-56"
            />
          </div>

          <button
            onClick={fetchRentals}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#14211F]/15 px-4 py-2.5 text-sm font-bold text-[#14211F] hover:bg-[#F4F1E8]"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4 p-5">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-20 rounded-xl bg-[#14211F]/5" />
          ))}
        </div>
      ) : filteredRentals.length === 0 ? (
        <div className="flex flex-col items-center px-5 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F4F1E8] text-[#F07842]">
            <ClipboardList size={30} />
          </div>

          <h3 className="mt-5 font-black text-[#14211F]">
            {search ? "No matching rentals" : "No rental bookings yet"}
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            {search
              ? "Try another customer or equipment name."
              : "Customer bookings for your equipment will appear here."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden overflow-x-auto xl:block">
            <table className="w-full min-w-[1150px] text-left">
              <thead className="bg-[#F4F1E8]/70">
                <tr className="text-[11px] uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Equipment</th>
                  <th className="px-5 py-4">Rental Duration</th>
                  <th className="px-5 py-4">Quantity</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Booking</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#14211F]/10">
                {filteredRentals.map((rental) => (
                  <tr key={rental._id} className="hover:bg-[#F4F1E8]/40">
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#14211F]">
                        {rental.customerName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {rental.customerEmail}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {rental.contactNumber}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {rental.equipmentImage && (
                          <img
                            src={rental.equipmentImage}
                            alt={rental.equipmentName}
                            className="h-11 w-11 rounded-lg object-cover"
                          />
                        )}
                        <span className="max-w-36 text-sm font-bold text-[#14211F]">
                          {rental.equipmentName}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CalendarDays size={15} />
                        <div>
                          <p>{formatDate(rental.startDate)}</p>
                          <p className="mt-1">
                            to {formatDate(rental.endDate)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-[#14211F]">
                      {rental.quantity}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-black text-[#14211F]">
                        {rental.currency?.toUpperCase() === "BDT" ? "৳" : "$"}
                        {Number(rental.totalAmount).toLocaleString()}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <PaymentBadge status={rental.paymentStatus} />
                    </td>

                    <td className="px-5 py-4">
                      <BookingBadge status={rental.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile and tablet cards */}
          <div className="grid gap-4 p-4 xl:hidden">
            {filteredRentals.map((rental) => (
              <article
                key={rental._id}
                className="rounded-xl border border-[#14211F]/10 p-4"
              >
                <div className="flex items-start gap-3">
                  {rental.equipmentImage && (
                    <img
                      src={rental.equipmentImage}
                      alt={rental.equipmentName}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-[#14211F]">
                      {rental.equipmentName}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {rental.customerName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {rental.customerEmail}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-[#F4F1E8] p-3">
                    <p className="text-xs text-gray-500">Rental Period</p>
                    <p className="mt-1 text-xs font-bold text-[#14211F]">
                      {formatDate(rental.startDate)}
                    </p>
                    <p className="text-xs font-bold text-[#14211F]">
                      to {formatDate(rental.endDate)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#F4F1E8] p-3">
                    <p className="text-xs text-gray-500">Booking Amount</p>
                    <p className="mt-1 font-black text-[#14211F]">
                      {rental.currency?.toUpperCase() === "BDT" ? "৳" : "$"}
                      {Number(rental.totalAmount).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Quantity: {rental.quantity}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <PaymentBadge status={rental.paymentStatus} />
                  <BookingBadge status={rental.status} />
                </div>

                <p className="mt-3 text-xs text-gray-500">
                  Contact: {rental.contactNumber}
                </p>
              </article>
            ))}
          </div>
        </>
      )}

      <div className="border-t border-[#14211F]/10 px-5 py-4 text-xs text-gray-500">
        Showing {filteredRentals.length} of {rentals.length} bookings
      </div>
    </section>
  );
}
