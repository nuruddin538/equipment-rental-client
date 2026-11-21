"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  Search,
  RefreshCw,
  Trash2,
  Pencil,
  X,
  Package,
} from "lucide-react";
import { toast } from "sonner";

import AdminTableSkeleton from "./AdminTableSkeleton";
import {
  deleteAdminEquipment,
  getAllEquipment,
  updateAdminEquipment,
  updateEquipmentStatus,
} from "@/lib/api/admin";

import type { AdminEquipment, EquipmentStatus } from "@/lib/types/admin";

const statusStyles: Record<EquipmentStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

export default function AllEquipmentTable() {
  const [items, setItems] = useState<AdminEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState("");
  const [editing, setEditing] = useState<AdminEquipment | null>(null);

  const loadEquipment = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getAllEquipment();
      setItems(result.equipment || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load equipment");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadEquipment = async () => {
      void loadEquipment();
    };

    void loadEquipment();
  }, []);

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesSearch =
          item.name?.toLowerCase().includes(search.toLowerCase()) ||
          item.category?.toLowerCase().includes(search.toLowerCase()) ||
          item.location?.toLowerCase().includes(search.toLowerCase());

        return matchesSearch && (filter === "all" || item.status === filter);
      }),
    [items, search, filter]
  );

  const changeStatus = async (
    item: AdminEquipment,
    status: EquipmentStatus
  ) => {
    if (!window.confirm(`Are you sure you want to ${status} "${item.name}"?`)) {
      return;
    }

    try {
      setBusyId(item._id);
      await updateEquipmentStatus(item._id, status);

      setItems((current) =>
        current.map((equipment) =>
          equipment._id === item._id ? { ...equipment, status } : equipment
        )
      );

      toast.success(`Equipment ${status}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Status update failed");
    } finally {
      setBusyId("");
    }
  };

  const handleDelete = async (item: AdminEquipment) => {
    if (!window.confirm(`Delete "${item.name}" permanently?`)) return;

    try {
      setBusyId(item._id);
      await deleteAdminEquipment(item._id);

      setItems((current) =>
        current.filter((equipment) => equipment._id !== item._id)
      );

      toast.success("Equipment deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId("");
    }
  };

  const saveEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;

    const form = new FormData(event.currentTarget);

    const data = {
      name: String(form.get("name") || "").trim(),
      description: String(form.get("description") || "").trim(),
      category: editing.category,
      location: editing.location,
      price: Number(form.get("price")),
      rentalType: editing.rentalType,
      availableQuantity: editing.availableQuantity,
      condition: editing.condition,
      brand: editing.brand,
      model: editing.model,
      imageUrl: editing.imageUrl,
    };

    if (!data.name || !Number.isFinite(data.price) || data.price <= 0) {
      toast.error("Enter a valid name and price");
      return;
    }

    try {
      setBusyId(editing._id);
      await updateAdminEquipment(editing._id, data);

      setItems((current) =>
        current.map((item) =>
          item._id === editing._id
            ? {
                ...item,
                name: data.name,
                description: data.description,
                price: data.price,
              }
            : item
        )
      );

      setEditing(null);
      toast.success("Equipment updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId("");
    }
  };

  if (loading) return <AdminTableSkeleton rows={7} columns={6} />;

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <p className="font-semibold text-red-600">{error}</p>
        <button
          onClick={() => void loadEquipment()}
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
        <div className="flex flex-col gap-4 border-b border-[#14211F]/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold">Equipment inventory</p>
            <p className="mt-1 text-xs text-[#14211F]/45">
              {filteredItems.length} equipment items
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
                placeholder="Search equipment"
                className="h-10 w-full rounded-xl border border-[#14211F]/10 pl-9 pr-3 text-sm outline-none sm:w-48"
              />
            </div>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="h-10 rounded-xl border border-[#14211F]/10 bg-white px-3 text-sm"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <button
              onClick={() => void loadEquipment()}
              className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#14211F] px-4 text-sm text-white"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="mx-auto text-[#14211F]/25" size={34} />
            <p className="mt-3 font-semibold">No equipment found</p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="bg-[#F4F1E8]/70 text-[10px] uppercase tracking-wider text-[#14211F]/50">
                  <tr>
                    <th className="px-5 py-4">Equipment</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Owner</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#14211F]/8">
                  {filteredItems.map((item) => (
                    <tr key={item._id} className="hover:bg-[#F4F1E8]/35">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-12 w-14 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-12 w-14 rounded-lg bg-[#F4F1E8]" />
                          )}
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="mt-1 text-xs text-[#14211F]/45">
                              {item.location}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-[#14211F]/60">
                        {item.category}
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        ৳{item.price?.toLocaleString("en-BD")}
                        <span className="block text-[10px] font-normal text-[#14211F]/45">
                          / {item.rentalType}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs text-[#14211F]/60">
                        {item.ownerName || item.ownerEmail || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-[10px] font-bold capitalize ${
                            statusStyles[item.status] || statusStyles.pending
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          {item.status !== "approved" && (
                            <button
                              disabled={busyId === item._id}
                              onClick={() =>
                                void changeStatus(item, "approved")
                              }
                              title="Approve"
                              className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                            >
                              <Check size={16} />
                            </button>
                          )}

                          {item.status !== "rejected" && (
                            <button
                              disabled={busyId === item._id}
                              onClick={() =>
                                void changeStatus(item, "rejected")
                              }
                              title="Reject"
                              className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                            >
                              <X size={16} />
                            </button>
                          )}

                          <button
                            onClick={() => setEditing(item)}
                            title="Update"
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            disabled={busyId === item._id}
                            onClick={() => void handleDelete(item)}
                            title="Delete"
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#14211F]/10 lg:hidden">
              {filteredItems.map((item) => (
                <div key={item._id} className="space-y-3 p-5">
                  <div className="flex gap-3">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-16 w-20 rounded-lg object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-bold">{item.name}</p>
                      <p className="mt-1 text-xs text-[#14211F]/50">
                        {item.category} · {item.location}
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        ৳{item.price} / {item.rentalType}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold capitalize ${
                        statusStyles[item.status] || statusStyles.pending
                      }`}
                    >
                      {item.status}
                    </span>
                    <div className="flex gap-1">
                      {item.status !== "approved" && (
                        <button
                          onClick={() => void changeStatus(item, "approved")}
                          className="rounded-lg bg-emerald-50 p-2 text-emerald-700"
                          aria-label="Approve"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      {item.status !== "rejected" && (
                        <button
                          onClick={() => void changeStatus(item, "rejected")}
                          className="rounded-lg bg-amber-50 p-2 text-amber-700"
                          aria-label="Reject"
                        >
                          <X size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => setEditing(item)}
                        className="rounded-lg bg-blue-50 p-2 text-blue-700"
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => void handleDelete(item)}
                        className="rounded-lg bg-red-50 p-2 text-red-600"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {editing && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-[#101B18]/60 p-4 backdrop-blur-sm">
          <form
            onSubmit={saveEdit}
            className="my-8 w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#F07842]">
                  Inventory management
                </p>
                <h2 className="mt-1 text-xl font-black">Update equipment</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg p-2 hover:bg-[#F4F1E8]"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-semibold">
                Equipment name
                <input
                  name="name"
                  required
                  defaultValue={editing.name}
                  className="mt-2 h-11 w-full rounded-xl border border-[#14211F]/15 px-3 text-sm outline-none focus:border-[#F07842]"
                />
              </label>

              <label className="block text-xs font-semibold">
                Description
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={editing.description}
                  className="mt-2 w-full rounded-xl border border-[#14211F]/15 p-3 text-sm outline-none focus:border-[#F07842]"
                />
              </label>

              <label className="block text-xs font-semibold">
                Rental price
                <input
                  name="price"
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  defaultValue={editing.price}
                  className="mt-2 h-11 w-full rounded-xl border border-[#14211F]/15 px-3 text-sm outline-none focus:border-[#F07842]"
                />
              </label>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-xl border border-[#14211F]/15 px-5 py-3 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busyId === editing._id}
                className="rounded-xl bg-[#14211F] px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {busyId === editing._id ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
