import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import EquipmentDetails from "@/components/equipment/EquipmentDetails";
import { getEquipmentById } from "@/lib/api/equipment";

export const instant = false;

interface EquipmentDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EquipmentDetailsPage({
  params,
}: EquipmentDetailsPageProps) {
  const { id } = await params;

  // Get request headers, including Better Auth cookies
  const requestHeaders = await headers();

  // Verify the current user's session
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  // Redirect unauthenticated users to the Sign In page
  if (!session?.user) {
    redirect("/login");
  }

  // Get JWT token from Better Auth
  const tokenResult = await auth.api.getToken({
    headers: requestHeaders,
  });

  const token = tokenResult?.token;

  // Redirect if the authentication token is unavailable
  if (!token) {
    redirect("/login");
  }

  // Fetch equipment details using the authenticated JWT
  const equipment = await getEquipmentById(id, token);

  // Show 404 if equipment does not exist
  if (!equipment) {
    notFound();
  }

  return <EquipmentDetails equipment={equipment} />;
}
