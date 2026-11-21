"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Search, RefreshCw, Heart, Eye, Trash2, MapPin } from "lucide-react";

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

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getMyFavorites();
      setFavorites(result.favorites || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load favorites");
    } finally {
      setLoading(false);
    }
  }, []);

  //   useEffect(() => {
  //     void loadFavorites();
  //   }, [loadFavorites]);

  useEffect(() => {
    const loadingFavorites = async () => {
      void loadFavorites();
    };

    void loadingFavorites();
  }, [loadFavorites]);

  const filteredFavorites = useMemo(() => {
    const term = search.toLowerCase();

    return favorites.filter((favorite) => {
      const equipment = favorite.equipment;

      return (
        equipment.name?.toLowerCase().includes(term) ||
        equipment.category?.toLowerCase().includes(term) ||
        equipment.location?.toLowerCase().includes(term)
      );
    });
  }, [favorites, search]);

  const handleRemove = async (favorite: FavoriteEquipment) => {
    const confirmed = window.confirm(
      `Remove "${favorite.equipment.name}" from your favorites?`
    );

    if (!confirmed) return;

    try {
      setBusyId(favorite.favoriteId);

      await removeFavorite(favorite.favoriteId);

      setFavorites((current) =>
        current.filter((item) => item.favoriteId !== favorite.favoriteId)
      );

      toast.success("Removed from favorites");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to remove favorite"
      );
    } finally {
      setBusyId("");
    }
  };

  if (loading) {
    return <CustomerTableSkeleton rows={6} columns={5} />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
        <p className="font-semibold text-red-600">{error}</p>

        <button
          onClick={() => void loadFavorites()}
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
          <p className="font-bold">Saved equipment</p>
          <p className="mt-1 text-xs text-[#14211F]/45">
            {filteredFavorites.length} saved items
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
              placeholder="Search favorites"
              className="h-10 w-full rounded-xl border border-[#14211F]/10 pl-9 pr-3 text-sm outline-none focus:border-[#F07842] sm:w-56"
            />
          </div>

          <button
            onClick={() => void loadFavorites()}
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#14211F] px-4 text-sm font-semibold text-white"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>
      </div>

      {filteredFavorites.length === 0 ? (
        <div className="px-5 py-16 text-center">
          <Heart size={36} className="mx-auto text-[#14211F]/25" />

          <p className="mt-3 font-semibold">No favorites found</p>

          <p className="mt-1 text-sm text-[#14211F]/45">
            Equipment you save will appear here.
          </p>

          <Link
            href="/equipment"
            className="mt-5 inline-flex rounded-xl bg-[#14211F] px-5 py-3 text-sm font-bold text-white"
          >
            Explore equipment
          </Link>
        </div>
      ) : (
        <>
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
                      className="hover:bg-[#F4F1E8]/35"
                    >
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

                          <p className="font-semibold">{item.name}</p>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-[#14211F]/60">
                        {item.category}
                      </td>

                      <td className="px-5 py-4 text-[#14211F]/60">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={13} />
                          {item.location}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-bold">
                        ৳{Number(item.price).toLocaleString("en-BD")}
                        <span className="block text-[10px] font-normal text-[#14211F]/45">
                          / {item.rentalType}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/equipment/${item._id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#14211F] px-3 py-2 text-xs font-semibold text-white"
                          >
                            <Eye size={14} />
                            Details
                          </Link>

                          <button
                            disabled={busyId === favorite.favoriteId}
                            onClick={() => void handleRemove(favorite)}
                            className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100 disabled:opacity-40"
                            aria-label="Remove favorite"
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

          <div className="grid gap-4 p-5 sm:grid-cols-2 md:hidden">
            {filteredFavorites.map((favorite) => {
              const item = favorite.equipment;

              return (
                <article
                  key={favorite.favoriteId}
                  className="overflow-hidden rounded-xl border border-[#14211F]/10"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="h-44 bg-[#F4F1E8]" />
                  )}

                  <div className="p-4">
                    <p className="font-bold">{item.name}</p>

                    <p className="mt-1 text-xs text-[#14211F]/50">
                      {item.category} · {item.location}
                    </p>

                    <p className="mt-3 font-black">
                      ৳{Number(item.price).toLocaleString("en-BD")}
                      <span className="ml-1 text-xs font-normal text-[#14211F]/45">
                        / {item.rentalType}
                      </span>
                    </p>

                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/equipment/${item._id}`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#14211F] px-3 py-2.5 text-xs font-bold text-white"
                      >
                        <Eye size={14} />
                        View Details
                      </Link>

                      <button
                        disabled={busyId === favorite.favoriteId}
                        onClick={() => void handleRemove(favorite)}
                        className="rounded-lg bg-red-50 px-3 text-red-500"
                        aria-label="Remove favorite"
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
  );
}
