"use client";

import { X, MapPin, CalendarDays, Package } from "lucide-react";
import type { Equipment } from "@/lib/types/owner";

export default function EquipmentDetailsDialog({
  equipment,
  onClose,
}: {
  equipment: Equipment | null;
  onClose: () => void;
}) {
  if (!equipment) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-[#F4F1E8] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 text-[#14211F] shadow"
          aria-label="Close details"
        >
          <X size={19} />
        </button>

        <img
          src={equipment.imageUrl}
          alt={equipment.name}
          className="h-64 w-full object-cover sm:h-80"
        />

        <div className="space-y-5 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full bg-[#C9DB83] px-3 py-1 text-xs font-bold text-[#14211F]">
              {equipment.category}
            </span>

            <span className="text-xs font-bold uppercase text-gray-500">
              {equipment.status}
            </span>
          </div>

          <h2 className="text-2xl font-black text-[#14211F]">
            {equipment.name}
          </h2>

          <p className="text-sm leading-7 text-gray-600">
            {equipment.description}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              ["Brand", equipment.brand],
              ["Model", equipment.model],
              ["Condition", equipment.condition],
              ["Quantity", String(equipment.availableQuantity)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-white p-4">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="mt-1 font-bold text-[#14211F]">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <MapPin size={17} />
              {equipment.location}
            </span>

            <span className="flex items-center gap-2">
              <CalendarDays size={17} />
              {equipment.rentalType}
            </span>

            <span className="flex items-center gap-2">
              <Package size={17} />
              {equipment.availableQuantity} available
            </span>
          </div>

          <div className="rounded-xl bg-[#14211F] p-5 text-[#F4F1E8]">
            <p className="text-xs text-[#C9DB83]">RENTAL PRICE</p>
            <p className="mt-1 text-2xl font-black">
              ৳
              {(equipment.price ?? equipment.pricePerDay ?? 0).toLocaleString()}
              <span className="ml-1 text-sm font-medium text-gray-300">
                / {equipment.rentalType}
              </span>
            </p>
          </div>

          <div>
            <h3 className="font-black text-[#14211F]">
              Rental Terms & Conditions
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-gray-600">
              {equipment.rentalTerms}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
