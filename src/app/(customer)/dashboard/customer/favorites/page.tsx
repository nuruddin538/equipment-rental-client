import CustomerPageHeader from "@/components/customer/CustomerPageHeader";
import FavoritesTable from "@/components/customer/FavoritesTable";

export default function CustomerFavoritesPage() {
  return (
    <div>
      <CustomerPageHeader
        eyebrow="Your saved collection"
        title="Favorite equipment."
        description="Keep your preferred equipment in one place and revisit the items you want to rent."
      />

      <FavoritesTable />
    </div>
  );
}
