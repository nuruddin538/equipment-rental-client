"use client";
import { useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface EquipmentImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function EquipmentImageUpload({
  value,
  onChange,
}: EquipmentImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be below 5MB.");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Image upload failed.");
      }
      onChange(result.data.url);
      toast.success("Equipment image upload successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image.");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-[#14211F]">
        Equipment Image
      </label>

      {value ? (
        <div className="relative h-64 overflow-hidden rounded-2xl border border-[#14211F]/10">
          <Image
            src={value}
            alt="Equipment preview"
            fill
            className="object-cover"
            unoptimized
          />

          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-600 shadow"
            aria-label="Remove image"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ) : (
        <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#14211F]/20 bg-[#F4F1E8]/50 transition hover:border-[#F07842]">
          {loading ? (
            <Loader2 className="animate-spin text-[#F07842]" size={30} />
          ) : (
            <ImagePlus size={32} className="text-[#F07842]" />
          )}

          <span className="text-sm font-semibold text-[#14211F]">
            {loading ? "Uploading..." : "Upload equipment image"}
          </span>

          <span className="text-xs text-gray-500">
            JPG, PNG or WEBP · Maximum 5MB
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={loading}
            onChange={handleUpload}
          />
        </label>
      )}
    </div>
  );
}
