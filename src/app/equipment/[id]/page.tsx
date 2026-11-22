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

  // Get request headers (including authentication cookies)
  const requestHeaders = await headers();

  // Get JWT token from Better Auth
  const tokenResult = await auth.api.getToken({
    headers: requestHeaders,
  });

  const token = tokenResult?.token;

  // Check authentication
  if (!token) {
    redirect("/signin");
  }

  // Fetch equipment using JWT
  const equipment = await getEquipmentById(id, token);

  // Check equipment availability
  if (!equipment) {
    notFound();
  }

  return <EquipmentDetails equipment={equipment} />;
}
