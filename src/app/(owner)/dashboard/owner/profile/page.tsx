import OwnerProfileForm from "@/components/owner/OwnerProfileForm";

export default function OwnerProfilePage() {
  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F07842]">
          OWNER WORKSPACE / ACCOUNT
        </p>

        <h1 className="mt-2 text-3xl font-black text-[#14211F] sm:text-4xl">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage your personal information and account details.
        </p>
      </header>

      <OwnerProfileForm />
    </div>
  );
}
