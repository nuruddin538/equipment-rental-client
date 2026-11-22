"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import type { BookingFormData, Equipment } from "@/lib/types/equipment";
import { createCheckout } from "@/lib/api/payments";

interface BookingModalProps {
  equipment: Equipment;
  open: boolean;
  onClose: () => void;
}

function getRentalUnits(
  startDate: string,
  endDate: string,
  rentalType: Equipment["rentalType"]
) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  const days =
    Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  if (rentalType === "weekly") return Math.ceil(days / 7);
  if (rentalType === "monthly") return Math.ceil(days / 30);

  return days;
}

export default function BookingModal({
  equipment,
  open,
  onClose,
}: BookingModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [contactNumber, setContactNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [loading, setLoading] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const minDate = useMemo(() => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().split("T")[0];
  }, []);

  const rentalUnits = useMemo(() => {
    if (!startDate || !endDate || endDate < startDate) {
      return 0;
    }

    return getRentalUnits(startDate, endDate, equipment.rentalType);
  }, [startDate, endDate, equipment.rentalType]);

  const totalPrice = rentalUnits * equipment.price * quantity;

  const handleCheckout = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select your rental dates.");
      return;
    }

    if (startDate < minDate) {
      toast.error("Start date cannot be in the past.");
      return;
    }

    if (endDate < startDate) {
      toast.error("End date cannot be before start date.");
      return;
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > equipment.availableQuantity
    ) {
      toast.error("Invalid equipment quantity.");
      return;
    }

    if (!contactNumber.trim()) {
      toast.error("Please enter your contact number.");
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error("Please enter your delivery address.");
      return;
    }

    setLoading(true);

    try {
      const bookingData: BookingFormData = {
        equipmentId: equipment._id,
        startDate,
        endDate,
        quantity: Number(quantity),
        contactNumber: contactNumber.trim(),
        deliveryAddress: deliveryAddress.trim(),
        additionalNotes: additionalNotes.trim(),
      };

      console.log("Checkout request payload:", bookingData);

      const result = await createCheckout(bookingData);

      if (!result.checkoutUrl) {
        throw new Error("Checkout URL was not returned.");
      }

      window.location.assign(result.checkoutUrl);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to start checkout."
      );

      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;

    setStartDate("");
    setEndDate("");
    setQuantity(1);
    setContactNumber("");
    setDeliveryAddress("");
    setAdditionalNotes("");

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Book Equipment</h2>
            <p className="mt-1 text-sm text-gray-500">
              Complete your rental information
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close booking modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Equipment Information */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h3 className="font-semibold text-gray-900">{equipment.name}</h3>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
            <span>
              ৳{equipment.price.toLocaleString("en-BD")} /{" "}
              {equipment.rentalType}
            </span>

            <span>Available: {equipment.availableQuantity}</span>
          </div>
        </div>

        {/* Booking Form */}
        <div className="space-y-5">
          {/* Rental Dates */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="startDate"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Start Date *
              </label>

              <div className="relative">
                <CalendarDays
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="startDate"
                  type="date"
                  min={minDate}
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);

                    if (endDate && e.target.value > endDate) {
                      setEndDate("");
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                End Date *
              </label>

              <div className="relative">
                <CalendarDays
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="endDate"
                  type="date"
                  min={startDate || minDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label
              htmlFor="quantity"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Quantity *
            </label>

            <input
              id="quantity"
              type="number"
              min={1}
              max={equipment.availableQuantity}
              step={1}
              value={quantity}
              onChange={(e) => {
                const value = Number(e.target.value);
                setQuantity(value);
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              required
            />

            <p className="mt-1 text-xs text-gray-500">
              Maximum available quantity: {equipment.availableQuantity}
            </p>
          </div>

          {/* Contact Number */}
          <div>
            <label
              htmlFor="contactNumber"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Contact Number *
            </label>

            <input
              id="contactNumber"
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="Enter your phone number"
              autoComplete="tel"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>

          {/* Delivery Address */}
          <div>
            <label
              htmlFor="deliveryAddress"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Delivery Address *
            </label>

            <textarea
              id="deliveryAddress"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your complete delivery address"
              rows={3}
              autoComplete="street-address"
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label
              htmlFor="additionalNotes"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Additional Notes{" "}
              <span className="font-normal text-gray-400">(Optional)</span>
            </label>

            <textarea
              id="additionalNotes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Any special instructions..."
              rows={2}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Price Summary */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Rental Units</span>
              <span>{rentalUnits}</span>
            </div>

            <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
              <span>Quantity</span>
              <span>{quantity}</span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-emerald-200 pt-3">
              <span className="font-semibold text-gray-900">
                Estimated Total
              </span>

              <span className="text-xl font-bold text-emerald-700">
                ৳{totalPrice.toLocaleString("en-BD")}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={
              loading ||
              !startDate ||
              !endDate ||
              !contactNumber.trim() ||
              !deliveryAddress.trim() ||
              quantity < 1 ||
              quantity > equipment.availableQuantity
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </button>

          <p className="text-center text-xs text-gray-500">
            You will be redirected to Stripe&apos;s secure checkout page.
          </p>
        </div>
      </div>
    </div>
  );
}
