"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Package,
  CalendarDays,
} from "lucide-react";

import type { Equipment } from "@/lib/types/equipment";
import FavoriteButton from "./FavoriteButton";
import BookingModal from "./BookingModel";

export default function EquipmentDetails({
  equipment,
}: {
  equipment: Equipment;
}) {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#F4F1E8] text-[#14211F]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/equipment"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#14211F]/60 transition hover:text-[#F07842]"
        >
          <ArrowLeft size={17} />
          Back to equipment
        </Link>

        <div className="mt-7 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          {/* Equipment Images */}
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white">
              {equipment.imageUrl ? (
                <Image
                  src={equipment.imageUrl}
                  alt={equipment.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[#14211F]/40">
                  No equipment image
                </div>
              )}

              <span className="absolute left-4 top-4 rounded-full bg-[#C9DB83] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#14211F]">
                {equipment.condition}
              </span>
            </div>

            {equipment.images && equipment.images.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {equipment.images.slice(0, 4).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative aspect-square overflow-hidden rounded-xl bg-white"
                  >
                    <Image
                      src={image}
                      alt={`${equipment.name} ${index + 1}`}
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Equipment Information */}
          <section className="flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F07842]">
                  {equipment.category}
                </p>

                <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                  {equipment.name}
                </h1>

                <p className="mt-3 flex items-center gap-2 text-sm text-[#14211F]/60">
                  <MapPin size={16} />
                  {equipment.location}
                </p>
              </div>

              <FavoriteButton equipmentId={equipment._id} />
            </div>

            {/* Rental Price */}
            <div className="mt-7 rounded-2xl border border-[#14211F]/10 bg-white p-5">
              <p className="text-sm text-[#14211F]/55">Rental price</p>

              <p className="mt-1 text-3xl font-black">
                ${equipment.price.toLocaleString()}
                <span className="ml-2 text-sm font-medium text-[#14211F]/50">
                  / {equipment.rentalType}
                </span>
              </p>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#14211F]/10 pt-5">
                <div>
                  <p className="text-xs text-[#14211F]/50">Availability</p>
                  <p className="mt-1 font-bold">
                    {equipment.availableQuantity} units
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#14211F]/50">Condition</p>
                  <p className="mt-1 font-bold">{equipment.condition}</p>
                </div>

                <div>
                  <p className="text-xs text-[#14211F]/50">Brand</p>
                  <p className="mt-1 font-bold">
                    {equipment.brand || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#14211F]/50">Model</p>
                  <p className="mt-1 font-bold">
                    {equipment.model || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Button */}
            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              disabled={equipment.availableQuantity < 1}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14211F] px-5 py-4 font-bold text-white transition hover:bg-[#263a36] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CalendarDays size={19} />
              {equipment.availableQuantity > 0
                ? "Book this equipment"
                : "Currently unavailable"}
            </button>

            {/* Security Information */}
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#C9DB83]/30 p-4">
              <ShieldCheck className="shrink-0 text-[#14211F]" />

              <p className="text-xs leading-relaxed text-[#14211F]/75">
                Secure checkout. Your booking is confirmed after successful
                payment verification.
              </p>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-lg font-bold">Equipment description</h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#14211F]/65">
                {equipment.description}
              </p>
            </div>

            {/* Rental Terms */}
            <div className="mt-7 border-t border-[#14211F]/10 pt-6">
              <h2 className="flex items-center gap-2 font-bold">
                <Package size={18} />
                Rental terms
              </h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#14211F]/65">
                {equipment.rentalTerms ||
                  "Please contact the equipment owner for rental terms."}
              </p>
            </div>

            {/* Equipment Owner */}
            {equipment.ownerName && (
              <div className="mt-7 rounded-2xl border border-[#14211F]/10 bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#14211F]/45">
                  Equipment owner
                </p>

                <p className="mt-2 text-lg font-bold">{equipment.ownerName}</p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        equipment={equipment}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </main>
  );
}
