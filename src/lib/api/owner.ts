import { authClient } from "@/lib/auth-client";

import type {
  Equipment,
  EquipmentFormData,
  OwnerProfile,
  OwnerRental,
} from "@/lib/types/owner";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function getAuthToken(): Promise<string> {
  const result = await authClient.token();

  const token = result.data?.token;
  if (!token) {
    throw new Error("Authentication token not found. Please sign in.");
  }
  return token;
}

async function ownerRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Something went wrong.");
  }
  return data as T;
}
// EQUIPMENT API

export async function createEquipment(payload: EquipmentFormData) {
  return ownerRequest<{
    success: boolean;
    message: string;
    equipment: Equipment;
  }>("/api/owner/equipment", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMyEquipment() {
  return ownerRequest<{
    success: boolean;
    count: number;
    equipment: Equipment[];
  }>("/api/owner/equipment");
}

export async function getOwnerEquipmentById(id: string) {
  return ownerRequest<{
    success: boolean;
    equipment: Equipment;
  }>(`/api/owner/equipment/${id}`);
}

export async function updateEquipment(id: string, payload: EquipmentFormData) {
  return ownerRequest<{ success: boolean; message: string }>(
    `/api/owner/equipment/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
}

export async function deleteEquipment(id: string) {
  return ownerRequest<{ success: boolean; message: string }>(
    `/api/owner/equipment/${id}`,
    {
      method: "DELETE",
    }
  );
}

// RENTAL API
export async function getOwnerRentals() {
  return ownerRequest<{
    success: boolean;
    count: number;
    rentals: OwnerRental[];
  }>("/api/owner/rentals");
}
// PROFILE API
export async function getOwnerProfile() {
  return ownerRequest<{
    success: boolean;
    profile: OwnerProfile;
  }>("/api/owner/profile");
}

export async function updateOwnerProfile(payload: {
  name: string;
  phone: string;
  image?: string;
}) {
  return ownerRequest<{ success: boolean; message: string }>(
    "/api/owner/profile",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
}
