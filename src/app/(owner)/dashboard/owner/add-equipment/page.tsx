import EquipmentForm from "@/components/owner/EquipmentForm";

export default function AddEquipmentPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F07842]">
          OWNER WORKSPACE / INVENTORY
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-[#14211F] sm:text-4xl">
          Add Equipment
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          List your equipment, set rental terms and make it available to
          customers after approval.
        </p>
      </header>

      <EquipmentForm />
    </div>
  );
}
