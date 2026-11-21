import CustomerDashboardShell from "@/components/customer/CustomerDashboardShell";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CustomerDashboardShell>{children}</CustomerDashboardShell>;
}
