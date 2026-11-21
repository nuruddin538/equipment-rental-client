import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AllEquipmentTable from "@/components/admin/AllEquipmentTable";

export default function AdminEquipmentPage() {
  return (
    <div>
      <AdminPageHeader
        eyebrow="Inventory control"
        title="All equipment."
        description="Review equipment submissions, approve or reject listings and manage the platform inventory."
      />

      <AllEquipmentTable />
    </div>
  );
}
