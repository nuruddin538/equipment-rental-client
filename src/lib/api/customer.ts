import { authClient } from "@/lib/auth-client";

import type {
  CustomerRental,
  FavoriteEquipment,
  CustomerProfile,
  ProfileUpdateData,
} from "@/lib/types/customer";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function customerRequest<T>(
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
// MY RENTALS
export async function getMyRentals() {
  return customerRequest<{
    success: boolean;
    count: number;
    rentals: CustomerRental[];
  }>("/api/customer/my-rentals");
}

// Favorites add

export async function addFavorite(equipmentId: string) {
  return customerRequest<{
    success: boolean;
    message: string;
    favoriteId: string;
  }>("/api/customer/favorites", {
    method: "POST",
    body: JSON.stringify({ equipmentId }),
  });
}

// FAVORITES
export async function getMyFavorites() {
  return customerRequest<{
    success: boolean;
    count: number;
    favorites: FavoriteEquipment[];
  }>("/api/customer/favorites");
}

export async function removeFavorite(id: string) {
  return customerRequest(`/api/customer/favorites/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// ShARED Profile
export async function getMyProfile() {
  return customerRequest<{
    success: boolean;
    profile: CustomerProfile;
  }>("/api/profile");
}

export async function updateMyProfile(data: ProfileUpdateData) {
  return customerRequest("/api/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
