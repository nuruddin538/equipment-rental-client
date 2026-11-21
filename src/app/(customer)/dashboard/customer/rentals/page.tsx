import CustomerPageHeader from "@/components/customer/CustomerPageHeader";
import MyRentalsTable from "@/components/customer/MyRentalsTable";

export default function CustomerRentalsPage() {
  return (
    <div>
      <CustomerPageHeader
        eyebrow="Booking history"
        title="My rentals."
        description="Track your equipment bookings, rental dates, payment status and booking progress."
      />

      <MyRentalsTable />
    </div>
  );
}
