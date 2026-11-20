import EquipmentTable from "@/components/owner/EquipmentTable";

export default function MyEquipmentPage() {
  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F07842]">
          OWNER WORKSPACE / INVENTORY
        </p>

        <h1 className="mt-2 text-3xl font-black text-[#14211F] sm:text-4xl">
          My Equipment
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Track, update and manage all your equipment listings.
        </p>
      </header>

      <EquipmentTable />
    </div>
  );
}
