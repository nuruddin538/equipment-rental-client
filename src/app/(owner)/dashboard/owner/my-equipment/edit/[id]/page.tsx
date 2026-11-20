"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import EquipmentForm from "@/components/owner/EquipmentForm";
import { getOwnerEquipmentById } from "@/lib/api/owner";
import type { Equipment } from "@/lib/types/owner";

export default function EditEquipmentPage() {
  const params = useParams<{ id: string }>();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const result = await getOwnerEquipmentById(params.id);
        setEquipment(result.equipment);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Equipment not found."
        );
      } finally {
        setLoading(false);
      }
    };
    void loadEquipment();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <LoaderCircle className="animate-spin text-[#F07842]" size={34} />
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center">
        <h2 className="font-black text-[#14211F]">Equipment not found</h2>

        <Link
          href="/dashboard/owner/my-equipment"
          className="mt-4 inline-block text-sm font-bold text-[#F07842]"
        >
          Back to My Equipment
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <Link
        href="/dashboard/owner/my-equipment"
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#F07842]"
      >
        <ArrowLeft size={17} />
        Back to equipment
      </Link>

      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F07842]">
          OWNER WORKSPACE / EDIT LISTING
        </p>

        <h1 className="mt-2 text-3xl font-black text-[#14211F]">
          Update Equipment
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Edit the information for {equipment.name}.
        </p>
      </header>

      <EquipmentForm initialData={equipment} editMode />
    </div>
  );
}
