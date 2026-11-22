"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  Search,
  RefreshCw,
  Heart,
  Eye,
  Trash2,
  MapPin,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

import CustomerTableSkeleton from "./CustomerTableSkeleton";

import { getMyFavorites, removeFavorite } from "@/lib/api/customer";

import type { FavoriteEquipment } from "@/lib/types/customer";

export default function FavoritesTable() {
  const [favorites, setFavorites] = useState<FavoriteEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState("");

  // Delete confirmation dialog states
  const [selectedFavorite, setSelectedFavorite] =
    useState<FavoriteEquipment | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  // Load favorites
  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getMyFavorites();

      setFavorites(Array.isArray(result.favorites) ? result.favorites : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load favorites."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadingFavorites = async () => {
      await loadFavorites();
    };

    void loadingFavorites();
  }, [loadFavorites]);

  // Search favorites
  const filteredFavorites = useMemo(() => {
    const term = search.trim().toLowerCase();

    return favorites.filter((favorite) => {
      const equipment = favorite.equipment;

      return (
        equipment.name?.toLowerCase().includes(term) ||
        equipment.category?.toLowerCase().includes(term) ||
        equipment.location?.toLowerCase().includes(term)
      );
    });
  }, [favorites, search]);

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (favorite: FavoriteEquipment) => {
    setSelectedFavorite(favorite);
    setDialogOpen(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    if (busyId) return;

    setDialogOpen(false);
    setSelectedFavorite(null);
  };

  // Confirm and remove favorite
  const handleConfirmRemove = async () => {
    if (!selectedFavorite || busyId) return;

    const favoriteId = selectedFavorite.favoriteId;

    try {
      setBusyId(favoriteId);

      await removeFavorite(favoriteId);

      setFavorites((current) =>
        current.filter((item) => item.favoriteId !== favoriteId)
      );

      toast.success("Removed from favorites successfully.");

      setDialogOpen(false);
      setSelectedFavorite(null);
    } catch (err) {
      console.error("Remove favorite error:", err);

      toast.error(
        err instanceof Error ? err.message : "Unable to remove favorite."
      );
    } finally {
      setBusyId("");
    }
  };

  // Loading state
  if (loading) {
    return <CustomerTableSkeleton rows={6} columns={5} />;
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
        <p className="font-semibold text-red-600">{error}</p>

        <button
          onClick={() => void loadFavorites()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#14211F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#263B35]"
        >
          <RefreshCw size={15} />
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
            <p className="font-bold text-[#14211F]">Saved equipment</p>

            <p className="mt-1 text-xs text-[#14211F]/45">
              {filteredFavorites.length} saved items
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#14211F]/40"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search favorites"
                className="h-10 w-full rounded-xl border border-[#14211F]/10 pl-9 pr-3 text-sm outline-none transition focus:border-[#F07842] sm:w-56"
              />
            </div>

            {/* Refresh */}
            <button
              onClick={() => void loadFavorites()}
              disabled={loading || !!busyId}
              className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#14211F] px-4 text-sm font-semibold text-white transition hover:bg-[#263B35] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredFavorites.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <Heart size={36} className="mx-auto text-[#14211F]/25" />

            <p className="mt-3 font-semibold text-[#14211F]">
              {search ? "No matching favorites found" : "No favorites found"}
            </p>

            <p className="mt-1 text-sm text-[#14211F]/45">
              {search
                ? "Try searching with another keyword."
                : "Equipment you save will appear here."}
            </p>

            {!search && (
              <Link
                href="/equipment"
                className="mt-5 inline-flex rounded-xl bg-[#14211F] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#263B35]"
              >
                Explore equipment
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-[#F4F1E8]/70 text-[10px] uppercase tracking-wider text-[#14211F]/50">
                  <tr>
                    <th className="px-5 py-4">Equipment</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Rental price</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#14211F]/8">
                  {filteredFavorites.map((favorite) => {
                    const item = favorite.equipment;

                    return (
                      <tr
                        key={favorite.favoriteId}
                        className="transition hover:bg-[#F4F1E8]/35"
                      >
                        {/* Equipment */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-12 w-14 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-14 items-center justify-center rounded-lg bg-[#F4F1E8]">
                                <Heart
                                  size={16}
                                  className="text-[#14211F]/30"
                                />
                              </div>
                            )}

                            <p className="font-semibold text-[#14211F]">
                              {item.name}
                            </p>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-4 text-[#14211F]/60">
                          {item.category || "N/A"}
                        </td>

                        {/* Location */}
                        <td className="px-5 py-4 text-[#14211F]/60">
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={13} />
                            {item.location || "N/A"}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-5 py-4 font-bold text-[#14211F]">
                          ৳{Number(item.price).toLocaleString("en-BD")}
                          <span className="block text-[10px] font-normal text-[#14211F]/45">
                            / {item.rentalType || "rental"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/equipment/${item._id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#14211F] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#263B35]"
                            >
                              <Eye size={14} />
                              Details
                            </Link>

                            <button
                              type="button"
                              disabled={busyId === favorite.favoriteId}
                              onClick={() => handleOpenDeleteDialog(favorite)}
                              className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100 disabled:opacity-40"
                              aria-label="Remove favorite"
                              title="Remove favorite"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-4 p-5 sm:grid-cols-2 md:hidden">
              {filteredFavorites.map((favorite) => {
                const item = favorite.equipment;

                return (
                  <article
                    key={favorite.favoriteId}
                    className="overflow-hidden rounded-xl border border-[#14211F]/10 bg-white"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-44 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-44 items-center justify-center bg-[#F4F1E8]">
                        <Heart size={30} className="text-[#14211F]/25" />
                      </div>
                    )}

                    <div className="p-4">
                      <p className="font-bold text-[#14211F]">{item.name}</p>

                      <p className="mt-1 text-xs text-[#14211F]/50">
                        {item.category || "N/A"} · {item.location || "N/A"}
                      </p>

                      <p className="mt-3 font-black text-[#14211F]">
                        ৳{Number(item.price).toLocaleString("en-BD")}
                        <span className="ml-1 text-xs font-normal text-[#14211F]/45">
                          / {item.rentalType || "rental"}
                        </span>
                      </p>

                      <div className="mt-4 flex gap-2">
                        <Link
                          href={`/equipment/${item._id}`}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#14211F] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#263B35]"
                        >
                          <Eye size={14} />
                          View Details
                        </Link>

                        <button
                          type="button"
                          disabled={busyId === favorite.favoriteId}
                          onClick={() => handleOpenDeleteDialog(favorite)}
                          className="rounded-lg bg-red-50 px-3 text-red-500 transition hover:bg-red-100 disabled:opacity-40"
                          aria-label="Remove favorite"
                          title="Remove favorite"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* Delete Confirmation Dialog */}
      {dialogOpen && selectedFavorite && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseDeleteDialog();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            className="relative w-full max-w-md animate-in fade-in zoom-in-95 rounded-2xl bg-white p-6 shadow-2xl duration-200 sm:p-7"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseDeleteDialog}
              disabled={!!busyId}
              className="absolute right-4 top-4 rounded-full p-2 text-[#14211F]/45 transition hover:bg-gray-100 hover:text-[#14211F] disabled:opacity-40"
              aria-label="Close dialog"
            >
              <X size={19} />
            </button>

            {/* Warning Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle size={27} className="text-red-500" />
            </div>

            {/* Dialog Content */}
            <div className="mt-5">
              <h2
                id="delete-dialog-title"
                className="text-xl font-bold tracking-tight text-[#14211F]"
              >
                Remove from favorites?
              </h2>

              <p
                id="delete-dialog-description"
                className="mt-2 text-sm leading-6 text-[#14211F]/60"
              >
                Are you sure you want to remove{" "}
                <span className="font-bold text-[#14211F]">
                  &quot;
                  {selectedFavorite.equipment.name}
                  &quot;
                </span>{" "}
                from your saved equipment? This action cannot be undone.
              </p>
            </div>

            {/* Dialog Actions */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseDeleteDialog}
                disabled={!!busyId}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#14211F]/15 px-5 text-sm font-semibold text-[#14211F] transition hover:bg-[#F4F1E8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleConfirmRemove()}
                disabled={!!busyId}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-500 px-5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busyId ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Yes, Remove
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
