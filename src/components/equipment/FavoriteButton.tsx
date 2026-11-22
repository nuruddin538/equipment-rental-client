"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { addFavorite, removeFavorite } from "@/lib/api/customer";

interface FavoriteButtonProps {
  equipmentId: string;
  initialFavorite?: boolean;
  initialFavoriteId?: string;
}

export default function FavoriteButton({
  equipmentId,
  initialFavorite = false,
  initialFavoriteId,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [favoriteId, setFavoriteId] = useState(initialFavoriteId || "");
  const [loading, setLoading] = useState(false);

  const handleFavorite = async () => {
    if (loading) return;

    setLoading(true);

    try {
      if (isFavorite) {
        if (!favoriteId) {
          throw new Error("Favorite record not found.");
        }

        await removeFavorite(favoriteId);

        setIsFavorite(false);
        setFavoriteId("");

        toast.success("Removed from favorites.");
      } else {
        const result = await addFavorite(equipmentId);

        setIsFavorite(true);
        setFavoriteId(result.favoriteId);

        toast.success("Added to favorites.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleFavorite}
      disabled={loading}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isFavorite}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-[#14211F]/15 bg-[#F4F1E8] transition hover:bg-[#e9e5da] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Heart
        size={21}
        className={
          isFavorite ? "fill-[#F07842] text-[#F07842]" : "text-[#14211F]"
        }
      />
    </button>
  );
}
