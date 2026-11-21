"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, ClipboardList } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AdminTableSkeleton from "./AdminTableSkeleton";
import { getAllRentals, updateRentalStatus } from "@/lib/api/admin";

import type { AdminRental, RentalStatus } from "@/lib/types/admin";

const statuses: RentalStatus[] = [
  "pending",
  "confirmed",
  "active",
  "completed",
  "cancelled",
  "rejected",
];

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  active: "bg-emerald-100 text-emerald-700",
  completed: "bg-[#14211F]/10 text-[#14211F]",
  cancelled: "bg-red-100 text-red-700",
  rejected: "bg-red-100 text-red-700",
};

export default function AllRentalsTable() {
  const [rentals, setRentals] = useState<AdminRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState("");

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    rental: AdminRental | null;
    status: RentalStatus | null;
  }>({
    open: false,
    rental: null,
    status: null,
  });

  // Fetch all rentals
  const loadRentals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getAllRentals();
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
    const loadRentals = async () => {
      void loadRentals();
    };

    void loadRentals();
  }, []);

  // Filter rentals
  const filteredRentals = useMemo(
    () =>
      rentals.filter((rental) => {
        const term = search.toLowerCase();

        const matchesSearch = [
          rental.customerName,
          rental.customerEmail,
          rental.ownerName,
          rental.ownerEmail,
          rental.equipmentName,
        ].some((value) => value?.toLowerCase().includes(term));

        return matchesSearch && (filter === "all" || rental.status === filter);
      }),
    [rentals, search, filter]
  );

  // Open confirmation dialog
  const handleStatusChange = (rental: AdminRental, status: RentalStatus) => {
    if (rental.status === status || busyId) return;

    setConfirmDialog({
      open: true,
      rental,
      status,
    });
  };

  // Confirm status update
  const confirmStatusChange = async () => {
    const { rental, status } = confirmDialog;

    if (!rental || !status || busyId) return;

    try {
      setBusyId(rental._id);

      await updateRentalStatus(rental._id, status);

      setRentals((current) =>
        current.map((item) =>
          item._id === rental._id ? { ...item, status } : item
        )
      );

      setConfirmDialog({
        open: false,
        rental: null,
        status: null,
      });

      toast.success("Booking status updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Status update failed");
    } finally {
      setBusyId("");
    }
  };

  // Close confirmation dialog
  const closeConfirmDialog = () => {
    if (busyId) return;

    setConfirmDialog({
      open: false,
      rental: null,
      status: null,
    });
  };

  if (loading) {
    return <AdminTableSkeleton rows={7} columns={7} />;
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <p className="font-semibold text-red-600">{error}</p>

        <button
          onClick={() => void loadRentals()}
          className="mt-4 rounded-xl bg-[#14211F] px-5 py-2.5 text-sm text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-[#14211F]/10 bg-white">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[#14211F]/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold">Rental activity</p>

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
                placeholder="Search bookings"
                className="h-10 w-full rounded-xl border border-[#14211F]/10 pl-9 pr-3 text-sm outline-none sm:w-56"
              />
            </div>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="h-10 rounded-xl border border-[#14211F]/10 bg-white px-3 text-sm"
            >
              <option value="all">All statuses</option>

              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button
              onClick={() => void loadRentals()}
              className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#14211F] px-4 text-sm text-white"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredRentals.length === 0 ? (
          <div className="py-16 text-center">
            <ClipboardList className="mx-auto text-[#14211F]/25" size={34} />

            <p className="mt-3 font-semibold">No rental records found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="bg-[#F4F1E8]/70 text-[10px] uppercase tracking-wider text-[#14211F]/50">
                  <tr>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Owner</th>
                    <th className="px-5 py-4">Equipment</th>
                    <th className="px-5 py-4">Duration</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4">Booking status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#14211F]/8">
                  {filteredRentals.map((rental) => (
                    <tr key={rental._id} className="hover:bg-[#F4F1E8]/35">
                      <td className="px-5 py-4">
                        <p className="font-semibold">
                          {rental.customerName || "Unknown customer"}
                        </p>

                        <p className="mt-1 text-xs text-[#14211F]/45">
                          {rental.customerEmail || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold">
                          {rental.ownerName || "Unknown owner"}
                        </p>

                        <p className="mt-1 text-xs text-[#14211F]/45">
                          {rental.ownerEmail || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        {rental.equipmentName || "Equipment"}
                      </td>

                      <td className="px-5 py-4 text-xs text-[#14211F]/60">
                        {rental.startDate
                          ? new Date(rental.startDate).toLocaleDateString()
                          : "—"}

                        <span className="mx-1">→</span>

                        {rental.endDate
                          ? new Date(rental.endDate).toLocaleDateString()
                          : "—"}
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
                        <select
                          value={rental.status}
                          disabled={busyId === rental._id}
                          onChange={(event) =>
                            handleStatusChange(
                              rental,
                              event.target.value as RentalStatus
                            )
                          }
                          className={`rounded-full border-0 px-3 py-2 text-[10px] font-bold capitalize outline-none disabled:opacity-50 ${
                            statusColors[rental.status] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Layout */}
            <div className="divide-y divide-[#14211F]/10 xl:hidden">
              {filteredRentals.map((rental) => (
                <div key={rental._id} className="space-y-4 p-5">
                  <div>
                    <p className="font-bold">
                      {rental.equipmentName || "Equipment"}
                    </p>

                    <p className="mt-1 text-xs text-[#14211F]/50">
                      Booking ID: {rental._id}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="mb-1 text-[#14211F]/40">Customer</p>

                      <p className="font-semibold">
                        {rental.customerName || "—"}
                      </p>

                      <p className="mt-1 break-all text-[#14211F]/50">
                        {rental.customerEmail || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-[#14211F]/40">Owner</p>

                      <p className="font-semibold">{rental.ownerName || "—"}</p>

                      <p className="mt-1 break-all text-[#14211F]/50">
                        {rental.ownerEmail || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-between gap-3 border-t border-[#14211F]/8 pt-3">
                    <div>
                      <p className="text-[10px] text-[#14211F]/40">Amount</p>

                      <p className="mt-1 font-bold">
                        {rental.currency || "BDT"}{" "}
                        {Number(rental.totalAmount || 0).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-[#14211F]/40">Payment</p>

                      <p className="mt-1 text-xs font-semibold capitalize">
                        {rental.paymentStatus || "unknown"}
                      </p>
                    </div>
                  </div>

                  <label className="block text-xs font-semibold">
                    Booking status
                    <select
                      value={rental.status}
                      disabled={busyId === rental._id}
                      onChange={(event) =>
                        handleStatusChange(
                          rental,
                          event.target.value as RentalStatus
                        )
                      }
                      className={`mt-2 w-full rounded-xl border-0 px-3 py-3 text-xs font-bold capitalize outline-none disabled:opacity-50 ${
                        statusColors[rental.status] || "bg-gray-100"
                      }`}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => {
          if (!open) closeConfirmDialog();
        }}
      >
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#14211F]">
              Confirm Booking Status
            </DialogTitle>

            <DialogDescription className="text-sm leading-6 text-[#14211F]/60">
              Are you sure you want to change the booking status from{" "}
              <strong className="capitalize text-[#14211F]">
                {confirmDialog.rental?.status}
              </strong>{" "}
              to{" "}
              <strong className="capitalize text-[#F07842]">
                {confirmDialog.status}
              </strong>
              ?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              disabled={!!busyId}
              onClick={closeConfirmDialog}
              className="rounded-xl border border-[#14211F]/15 px-5 py-2.5 text-sm font-semibold text-[#14211F] transition hover:bg-[#14211F]/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!!busyId}
              onClick={() => void confirmStatusChange()}
              className="rounded-xl bg-[#14211F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#213a35] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busyId ? "Updating..." : "Confirm"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
