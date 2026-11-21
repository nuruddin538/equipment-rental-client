import CustomerPageHeader from "@/components/customer/CustomerPageHeader";
import CustomerProfileForm from "@/components/customer/CustomerProfileForm";

export default function CustomerProfilePage() {
  return (
    <div>
      <CustomerPageHeader
        eyebrow="Account management"
        title="My profile."
        description="Manage your name, profile image, phone number and address."
      />

      <CustomerProfileForm />
    </div>
  );
}
