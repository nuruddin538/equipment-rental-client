"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, SlidersHorizontal, ArrowLeft } from "lucide-react";

import { getAllEquipment } from "@/lib/api/equipment";
import type { Equipment } from "@/lib/types/equipment";

import { toast } from "sonner";

interface Filters {
  search: string;
  category: string;
  rentalType: string;
  minPrice: string;
  maxPrice: string;
  availability: string;
  sort: string;
}

const initialFilters: Filters = {
  search: "",
  category: "",
  rentalType: "",
  minPrice: "",
  maxPrice: "",
  availability: "",
  sort: "recent",
};

export default function AllEquipmentPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(initialFilters);

  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadEquipment() {
      try {
        setError("");

        const response = await getAllEquipment(
          {
            ...appliedFilters,
            page,
            limit: 12,
          },
          controller.signal
        );

        if (!active) return;

        setEquipments(response.equipments);
        setTotalPages(response.pagination.totalPages);
        setTotal(response.pagination.total);
        setCategories(response.categories || []);
      } catch (error) {
        if (!active || controller.signal.aborted) return;

        const message =
          error instanceof Error ? error.message : "Failed to load equipment";

        setError(message);
        setEquipments([]);
        toast.error(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEquipment();

    return () => {
      active = false;
      controller.abort();
    };
  }, [appliedFilters, page]);

  const handleApplyFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const min = Number(filters.minPrice);
    const max = Number(filters.maxPrice);

    if (
      (filters.minPrice !== "" && (!Number.isFinite(min) || min < 0)) ||
      (filters.maxPrice !== "" && (!Number.isFinite(max) || max < 0)) ||
      (filters.minPrice !== "" && filters.maxPrice !== "" && min > max)
    ) {
      toast.error("Please enter a valid price range");
      return;
    }

    setLoading(true);
    setPage(1);
    setAppliedFilters({ ...filters });
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setLoading(true);
    setPage(1);
    setAppliedFilters(initialFilters);
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;

    setLoading(true);
    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#14211F]/60 transition hover:text-[#F07842]"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>
          <p className="font-medium text-emerald-700">
            Find the right equipment
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            All Equipment
          </h1>

          <p className="mt-2 text-gray-500">
            Browse and rent quality equipment for your needs.
          </p>
        </div>

        {/* Search and Filters */}
        <form
          onSubmit={handleApplyFilters}
          className="mb-8 rounded-2xl border bg-white p-5 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-emerald-700" />

            <h2 className="font-semibold">Search & Filter Equipment</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Search */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label
                htmlFor="equipment-search"
                className="mb-2 block text-sm font-medium"
              >
                Search by Name or Location
              </label>

              <div className="relative">
                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="equipment-search"
                  type="search"
                  value={filters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  placeholder="Search camera, generator, Chittagong..."
                  className="w-full rounded-lg border py-3 pl-10 pr-4 outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium"
              >
                Category
              </label>

              <select
                id="category"
                value={filters.category}
                onChange={(e) => updateFilter("category", e.target.value)}
                className="w-full rounded-lg border bg-white px-3 py-3 outline-none focus:border-emerald-600"
              >
                <option value="">All Categories</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Rental Type */}
            <div>
              <label
                htmlFor="rentalType"
                className="mb-2 block text-sm font-medium"
              >
                Rental Type
              </label>

              <select
                id="rentalType"
                value={filters.rentalType}
                onChange={(e) => updateFilter("rentalType", e.target.value)}
                className="w-full rounded-lg border bg-white px-3 py-3 outline-none focus:border-emerald-600"
              >
                <option value="">All Rental Types</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label
                htmlFor="availability"
                className="mb-2 block text-sm font-medium"
              >
                Availability
              </label>

              <select
                id="availability"
                value={filters.availability}
                onChange={(e) => updateFilter("availability", e.target.value)}
                className="w-full rounded-lg border bg-white px-3 py-3 outline-none focus:border-emerald-600"
              >
                <option value="">All Equipment</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            {/* Minimum Price */}
            <div>
              <label
                htmlFor="minPrice"
                className="mb-2 block text-sm font-medium"
              >
                Minimum Price ($)
              </label>

              <input
                id="minPrice"
                type="number"
                min="0"
                value={filters.minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                placeholder="Min price"
                className="w-full rounded-lg border px-3 py-3 outline-none focus:border-emerald-600"
              />
            </div>

            {/* Maximum Price */}
            <div>
              <label
                htmlFor="maxPrice"
                className="mb-2 block text-sm font-medium"
              >
                Maximum Price ($)
              </label>

              <input
                id="maxPrice"
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                placeholder="Max price"
                className="w-full rounded-lg border px-3 py-3 outline-none focus:border-emerald-600"
              />
            </div>

            {/* Sorting */}
            <div>
              <label htmlFor="sort" className="mb-2 block text-sm font-medium">
                Sort By
              </label>

              <select
                id="sort"
                value={filters.sort}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="w-full rounded-lg border bg-white px-3 py-3 outline-none focus:border-emerald-600"
              >
                <option value="recent">Recently Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-lg bg-emerald-700 px-6 py-3 font-medium text-white transition hover:bg-emerald-800"
            >
              Apply Filters
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Reset Filters
            </button>
          </div>
        </form>

        {/* Result Header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-gray-900">
            Equipment Results
          </h2>

          <p className="text-sm text-gray-500">{total} equipment found</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-xl bg-gray-200"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setAppliedFilters({ ...appliedFilters });
              }}
              className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && equipments.length === 0 && (
          <div className="rounded-xl border border-dashed bg-white p-12 text-center">
            <h3 className="text-xl font-semibold">No Equipment Found</h3>

            <p className="mt-2 text-sm text-gray-500">
              Try changing your search or filter options.
            </p>

            <button
              type="button"
              onClick={handleReset}
              className="mt-5 rounded-lg bg-emerald-700 px-5 py-2.5 text-white"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Equipment Grid */}
        {!loading && !error && equipments.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {equipments.map((equipment) => {
              const price =
                equipment.displayPrice ??
                equipment.pricePerDay ??
                equipment.price;

              const isAvailable =
                equipment.isAvailable ?? equipment.availableQuantity > 0;

              return (
                <article
                  key={equipment._id}
                  className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative h-56 bg-gray-100">
                    {equipment.imageUrl ? (
                      <Image
                        src={equipment.imageUrl}
                        alt={equipment.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        No Image Available
                      </div>
                    )}

                    {/* Availability Badge */}
                    <span
                      className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                        isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        {equipment.category}
                      </span>

                      <span className="text-xs capitalize text-gray-500">
                        {equipment.rentalType}
                      </span>
                    </div>

                    <h3 className="line-clamp-1 text-lg font-bold text-gray-900">
                      {equipment.name}
                    </h3>

                    <p className="mt-3 text-2xl font-bold text-emerald-700">
                      ${price}
                      <span className="ml-1 text-sm font-normal text-gray-500">
                        / {equipment.rentalType}
                      </span>
                    </p>

                    <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={16} />
                      <span className="line-clamp-1">{equipment.location}</span>
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      {isAvailable
                        ? `${equipment.availableQuantity} item(s) available`
                        : "Currently unavailable"}
                    </p>

                    <Link
                      href={`/equipment/${equipment._id}`}
                      className="mt-5 block rounded-lg bg-emerald-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-800"
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
              className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => handlePageChange(pageNumber)}
                  className={`h-10 min-w-10 rounded-lg border px-3 ${
                    page === pageNumber
                      ? "border-emerald-700 bg-emerald-700 text-white"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              )
            )}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
