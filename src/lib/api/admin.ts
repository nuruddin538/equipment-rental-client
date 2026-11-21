import { updateEquipment } from "@/lib/api/owner";
import { authClient } from "@/lib/auth-client";

import type {
  AdminUser,
  AdminEquipment,
  AdminRental,
  AdminProfile,
  EquipmentUpdateData,
  UserRole,
  EquipmentStatus,
  RentalStatus,
} from "@/lib/types/admin";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function adminRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const tokenResult = await authClient.token();
  const token = tokenResult.data?.token;

  if (!token) {
    throw new Error("Authentication required. Please sign in again.");
  }
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    cache: "no-store",
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || `Request failed (${response.status})`);
  }
  return result as T;
}

// USERS
export async function getAllUsers() {
  return adminRequest<{
    success: boolean;
    count: number;
    users: AdminUser[];
  }>("/api/admin/users");
}

export async function updateUserRole(id: string, role: UserRole) {
  return adminRequest("/api/admin/users/" + id + "/role", {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export async function deleteUser(id: string) {
  return adminRequest("/api/admin/users/" + id, {
    method: "DELETE",
  });
}
// EQUIPMENT
export async function getAllEquipment() {
  return adminRequest<{
    success: boolean;
    count: number;
    equipment: AdminEquipment[];
  }>("/api/admin/equipment");
}

export async function updateEquipmentStatus(
  id: string,
  status: EquipmentStatus
) {
  return adminRequest("/api/admin/equipment/" + id + "/status", {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function updateAdminEquipment(
  id: string,
  data: EquipmentUpdateData
) {
  return adminRequest("/api/admin/equipment/" + id, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteAdminEquipment(id: string) {
  return adminRequest("/api/admin/equipment/" + id, {
    method: "DELETE",
  });
}
// RENTALS
export async function getAllRentals() {
  return adminRequest<{
    success: boolean;
    count: number;
    rentals: AdminRental[];
  }>("/api/admin/rentals");
}

export async function updateRentalStatus(id: string, status: RentalStatus) {
  return adminRequest("/api/admin/rentals/" + id + "/status", {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
// ADMIN PROFILE
export async function getAdminProfile() {
  return adminRequest<{
    success: boolean;
    profile: AdminProfile;
  }>("/api/admin/profile");
}

export async function updateAdminProfile(data: {
  name: string;
  phone: string;
  image: string;
}) {
  return adminRequest("/api/admin/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
