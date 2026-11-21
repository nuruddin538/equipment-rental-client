import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AllRentalsTable from "@/components/admin/AllRentalsTable";

export default function AdminRentalsPage() {
  return (
    <div>
      <AdminPageHeader
        eyebrow="Booking operations"
        title="All rentals."
        description="Monitor customer and owner information, rental duration, payment status and booking progress."
      />

      <AllRentalsTable />
    </div>
  );
}
