import RentalTable from "@/components/owner/RentalTable";

export default function MyRentalsPage() {
  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F07842]">
          OWNER WORKSPACE / BOOKINGS
        </p>

        <h1 className="mt-2 text-3xl font-black text-[#14211F] sm:text-4xl">
          My Equipment Rental
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Monitor customers, rental periods, quantities and payments.
        </p>
      </header>

      <RentalTable />
    </div>
  );
}
