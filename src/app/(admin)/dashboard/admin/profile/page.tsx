import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminProfileForm from "@/components/admin/AdminProfileForm";

export default function AdminProfilePage() {
  return (
    <div>
      <AdminPageHeader
        eyebrow="Account management"
        title="My profile."
        description="Manage your administrator identity and personal account information."
      />

      <AdminProfileForm />
    </div>
  );
}
