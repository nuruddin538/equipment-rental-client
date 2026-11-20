"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, Save, Send } from "lucide-react";
import { toast } from "sonner";

import EquipmentImageUpload from "./EquipmentImageUpload";

import { createEquipment, updateEquipment } from "@/lib/api/owner";

import type {
  Equipment,
  EquipmentFormData,
  RentalType,
  EquipmentCondition,
} from "@/lib/types/owner";

const categories = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

const initialForm: EquipmentFormData = {
  name: "",
  description: "",
  category: "",
  location: "",
  price: 0,
  rentalType: "daily",
  availableQuantity: 1,
  condition: "Good",
  brand: "",
  model: "",
  imageUrl: "",
  rentalTerms: "",
};

interface Props {
  initialData?: Equipment;
  editMode?: boolean;
}
const inputClass =
  "w-full rounded-xl border border-[#14211F]/15 bg-white px-4 py-3 text-sm text-[#14211F] outline-none transition placeholder:text-gray-400 focus:border-[#F07842] focus:ring-4 focus:ring-[#F07842]/10";

const labelClass = "mb-2 block text-sm font-bold text-[#14211F]";

export default function EquipmentForm({
  initialData,
  editMode = false,
}: Props) {
  const router = useRouter();

  const [form, setForm] = useState<EquipmentFormData>(
    initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          category: initialData.category,
          location: initialData.location,
          price: initialData.price ?? initialData.pricePerDay ?? 0,
          rentalType: initialData.rentalType,
          availableQuantity: initialData.availableQuantity,
          condition: initialData.condition,
          brand: initialData.brand,
          model: initialData.model,
          imageUrl: initialData.imageUrl,
          rentalTerms: initialData.rentalTerms,
        }
      : initialForm
  );

  const [submitting, setSubmitting] = useState(false);

  const updateField = <K extends keyof EquipmentFormData>(
    key: K,
    value: EquipmentFormData[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.imageUrl) {
      toast.error("Please upload an equipment image.");
      return;
    }
    if (form.price <= 0 || form.availableQuantity < 1) {
      toast.error("Please enter a valid price and quantity.");
      return;
    }
    try {
      setSubmitting(true);

      if (editMode && initialData) {
        await updateEquipment(initialData._id, form);
        toast.success("Equipment updated successfully.");
      } else {
        await createEquipment(form);
        toast.success("Equipment submitted for approval.");
      }

      router.push("/dashboard/owner/my-equipment");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="grid gap-7 xl:grid-cols-[1fr_340px]">
        <div className="space-y-7">
          {/* Basic Information */}
          <section className="rounded-2xl border border-[#14211F]/10 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F07842]">
                Step 01 / Equipment
              </p>
              <h2 className="mt-2 text-xl font-black text-[#14211F]">
                Basic information
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Tell customers what makes this equipment valuable.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Equipment Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g. Heavy Duty Excavator"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Description *</label>
                <textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Describe the equipment, its features and usage..."
                  className={`${inputClass} resize-y`}
                />
              </div>

              <div>
                <label className={labelClass}>Category *</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Location *</label>
                <input
                  required
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="e.g. Chattogram, Bangladesh"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="rounded-2xl border border-[#14211F]/10 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F07842]">
                Step 02 / Pricing
              </p>
              <h2 className="mt-2 text-xl font-black text-[#14211F]">
                Rental and availability
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Rental Price *</label>
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.price || ""}
                  onChange={(e) => updateField("price", Number(e.target.value))}
                  placeholder="e.g. 5000"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Rental Type *</label>
                <select
                  value={form.rentalType}
                  onChange={(e) =>
                    updateField("rentalType", e.target.value as RentalType)
                  }
                  className={inputClass}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Available Quantity *</label>
                <input
                  required
                  type="number"
                  min="1"
                  step="1"
                  value={form.availableQuantity}
                  onChange={(e) =>
                    updateField("availableQuantity", Number(e.target.value))
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Equipment Condition *</label>
                <select
                  value={form.condition}
                  onChange={(e) =>
                    updateField(
                      "condition",
                      e.target.value as EquipmentCondition
                    )
                  }
                  className={inputClass}
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
            </div>
          </section>

          {/* Specifications */}
          <section className="rounded-2xl border border-[#14211F]/10 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F07842]">
                Step 03 / Specifications
              </p>
              <h2 className="mt-2 text-xl font-black text-[#14211F]">
                Equipment details
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Brand *</label>
                <input
                  required
                  value={form.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                  placeholder="e.g. Caterpillar"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Model *</label>
                <input
                  required
                  value={form.model}
                  onChange={(e) => updateField("model", e.target.value)}
                  placeholder="e.g. CAT 320D"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Rental Terms */}
          <section className="rounded-2xl border border-[#14211F]/10 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F07842]">
                Step 04 / Rental Policy
              </p>
              <h2 className="mt-2 text-xl font-black text-[#14211F]">
                Terms and conditions
              </h2>
            </div>

            <textarea
              required
              rows={5}
              value={form.rentalTerms}
              onChange={(e) => updateField("rentalTerms", e.target.value)}
              placeholder="Explain deposit requirements, return policy, damage policy and other rental conditions..."
              className={`${inputClass} resize-y`}
            />
          </section>
        </div>

        {/* Image and publishing panel */}
        <aside className="space-y-5">
          <section className="rounded-2xl border border-[#14211F]/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-black text-[#14211F]">
              Equipment photography
            </h2>

            <EquipmentImageUpload
              value={form.imageUrl}
              onChange={(url) => updateField("imageUrl", url)}
            />
          </section>

          <section className="rounded-2xl bg-[#14211F] p-5 text-[#F4F1E8]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9DB83]">
              Before publishing
            </p>

            <h3 className="mt-3 text-lg font-black">
              Quality listings attract better renters.
            </h3>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#BCC8C1]">
              <li>• Use clear, real equipment photographs.</li>
              <li>• Provide accurate specifications.</li>
              <li>• Set a fair rental price.</li>
              <li>• Explain your rental terms clearly.</li>
            </ul>

            {!editMode && (
              <div className="mt-5 rounded-xl bg-white/10 p-3">
                <p className="text-xs text-[#C9DB83]">SUBMISSION STATUS</p>
                <p className="mt-1 font-bold">Pending Admin Approval</p>
              </div>
            )}
          </section>
        </aside>
      </div>

      <div className="flex flex-col-reverse justify-end gap-3 border-t border-[#14211F]/10 pt-5 sm:flex-row">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#14211F]/15 px-6 py-3 text-sm font-bold text-[#14211F] transition hover:bg-white"
        >
          <ArrowLeft size={17} />
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#F07842] px-7 py-3 text-sm font-black text-[#14211F] transition hover:bg-[#e96935] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : editMode ? (
            <Save size={18} />
          ) : (
            <Send size={18} />
          )}

          {submitting
            ? "Saving..."
            : editMode
            ? "Save Changes"
            : "Submit Equipment"}
        </button>
      </div>
    </form>
  );
}
