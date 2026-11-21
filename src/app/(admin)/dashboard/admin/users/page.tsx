import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AllUsersTable from "@/components/admin/AllUsersTable";

export default function AdminUsersPage() {
  return (
    <div>
      <AdminPageHeader
        eyebrow="People and permissions"
        title="All users."
        description="View registered accounts, assign platform roles and manage user access."
      />

      <AllUsersTable />
    </div>
  );
}
