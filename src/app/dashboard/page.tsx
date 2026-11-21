import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardRedirect() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  switch (session.user.role) {
    case "admin":
      redirect("/dashboard/admin");

    case "owner":
      redirect("/dashboard/owner");

    case "customer":
      redirect("/dashboard/customer");

    default:
      redirect("/");
  }
}
