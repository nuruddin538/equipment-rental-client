"use client";

import { useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function EquipmentImageUpload({ value, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      toast.error("ImgBB API key is not configured.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success || !result.data?.url) {
        throw new Error(result.error?.message || "Image upload failed.");
      }

      onChange(result.data.url);
      toast.success("Image uploaded successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Image upload failed."
      );
    } finally {
      setLoading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-bold text-[#14211F]">
        Equipment Image <span className="text-[#F07842]">*</span>
      </label>

      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-[#14211F]/10 bg-white">
          <img
            src={value}
            alt="Equipment preview"
            className="h-64 w-full object-cover"
          />

          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-600 shadow-lg transition hover:bg-red-50"
            aria-label="Remove image"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex min-h-56 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#14211F]/20 bg-white/60 p-6 text-center transition hover:border-[#F07842] hover:bg-white disabled:opacity-60"
        >
          {loading ? (
            <LoaderCircle size={32} className="animate-spin text-[#F07842]" />
          ) : (
            <ImagePlus size={34} className="text-[#F07842]" />
          )}

          <span className="font-bold text-[#14211F]">
            {loading ? "Uploading image..." : "Upload equipment image"}
          </span>

          <span className="text-xs text-gray-500">
            JPG, PNG, WEBP · Maximum 5MB
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => uploadImage(event.target.files?.[0])}
      />
    </div>
  );
}
