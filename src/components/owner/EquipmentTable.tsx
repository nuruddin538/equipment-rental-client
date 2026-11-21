"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  Package,
  LoaderCircle,
  Plus,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { deleteEquipment, getMyEquipment } from "@/lib/api/owner";
import type { Equipment } from "@/lib/types/owner";
import EquipmentDetailsDialog from "./EquipmentDetailsDialog";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function EquipmentSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-5">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="h-16 rounded-xl bg-[#14211F]/5" />
      ))}
    </div>
  );
}

export default function EquipmentTable() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const result = await getMyEquipment();
      setEquipment(result.equipment || []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load equipment."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadEquipment = async () => {
      await fetchEquipment();
    };

    void loadEquipment();
  }, []);

  const confirmDelete = (itemName: string): Promise<boolean> => {
    return new Promise((resolve) => {
      toast(`Delete "${itemName}"?`, {
        description: "This action cannot be undone.",
        duration: Infinity,
        action: {
          label: "Delete",
          onClick: () => resolve(true),
        },
        cancel: {
          label: "Cancel",
          onClick: () => resolve(false),
        },
        onDismiss: () => resolve(false),
      });
    });
  };

  const handleDelete = async (item: Equipment) => {
    const confirmed = await confirmDelete(item.name);
    if (!confirmed) return;

    try {
      setDeletingId(item._id);

      await deleteEquipment(item._id);

      setEquipment((previous) =>
        previous.filter((equipment) => equipment._id !== item._id)
      );

      toast.success("Equipment deleted successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredEquipment = equipment.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(searchText) ||
      item.category.toLowerCase().includes(searchText) ||
      item.location.toLowerCase().includes(searchText)
    );
  });
  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[#14211F]/10 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#14211F]/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-lg font-black text-[#14211F]">
              Equipment inventory
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your listed equipment and availability.
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
                placeholder="Search equipment..."
                className="w-full rounded-xl border border-[#14211F]/15 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#F07842] sm:w-56"
              />
            </div>

            <button
              onClick={fetchEquipment}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#14211F]/15 px-4 py-2.5 text-sm font-bold text-[#14211F] hover:bg-[#F4F1E8]"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <Link
              href="/dashboard/owner/add-equipment"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#F07842] px-4 py-2.5 text-sm font-bold text-[#14211F] hover:bg-[#e96935]"
            >
              <Plus size={17} />
              Add New
            </Link>
          </div>
        </div>

        {loading ? (
          <EquipmentSkeleton />
        ) : filteredEquipment.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F4F1E8] text-[#F07842]">
              <Package size={30} />
            </div>

            <h3 className="mt-5 font-black text-[#14211F]">
              {search ? "No matching equipment" : "No equipment yet"}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-gray-500">
              {search
                ? "Try searching with another equipment name or category."
                : "Add your first equipment to start building your rental inventory."}
            </p>

            {!search && (
              <Link
                href="/dashboard/owner/add-equipment"
                className="mt-5 rounded-xl bg-[#14211F] px-5 py-3 text-sm font-bold text-white"
              >
                Add Equipment
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-[#F4F1E8]/70">
                  <tr className="text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4">Equipment</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Rental Price</th>
                    <th className="px-5 py-4">Quantity</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#14211F]/10">
                  {filteredEquipment.map((item) => (
                    <tr
                      key={item._id}
                      className="transition hover:bg-[#F4F1E8]/40"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                          <div>
                            <p className="font-bold text-[#14211F]">
                              {item.name}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {item.brand} · {item.model}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {item.category}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-bold text-[#14211F]">
                          ৳
                          {(
                            item.price ??
                            item.pricePerDay ??
                            0
                          ).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          / {item.rentalType}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-[#14211F]">
                        {item.availableQuantity}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => setSelectedEquipment(item)}
                            title="View details"
                            className="rounded-lg p-2 text-gray-500 hover:bg-[#F4F1E8] hover:text-[#14211F]"
                          >
                            <Eye size={17} />
                          </button>

                          <Link
                            href={`/dashboard/owner/my-equipment/edit/${item._id}`}
                            title="Update equipment"
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil size={17} />
                          </Link>

                          <button
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item._id}
                            title="Delete equipment"
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-40"
                          >
                            {deletingId === item._id ? (
                              <LoaderCircle
                                size={17}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={17} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 p-4 md:hidden">
              {filteredEquipment.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-[#14211F]/10 p-4"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-[#14211F]">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {item.category}
                      </p>

                      <p className="mt-2 font-black text-[#14211F]">
                        ৳
                        {(item.price ?? item.pricePerDay ?? 0).toLocaleString()}
                        <span className="text-xs font-medium text-gray-500">
                          {" "}
                          / {item.rentalType}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <StatusBadge status={item.status} />
                    <span className="text-xs text-gray-500">
                      Qty: {item.availableQuantity}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2 border-t border-[#14211F]/10 pt-3">
                    <button
                      onClick={() => setSelectedEquipment(item)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#F4F1E8] py-2 text-xs font-bold text-[#14211F]"
                    >
                      <Eye size={15} /> View
                    </button>

                    <Link
                      href={`/dashboard/owner/my-equipment/edit/${item._id}`}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-50 py-2 text-xs font-bold text-blue-700"
                    >
                      <Pencil size={15} /> Update
                    </Link>

                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item._id}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-50 py-2 text-xs font-bold text-red-600"
                    >
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="border-t border-[#14211F]/10 px-5 py-4 text-xs text-gray-500">
          Showing {filteredEquipment.length} of {equipment.length} equipment
          items
        </div>
      </div>

      <EquipmentDetailsDialog
        equipment={selectedEquipment}
        onClose={() => setSelectedEquipment(null)}
      />
    </>
  );
}
