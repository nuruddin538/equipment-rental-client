import { authClient } from "@/lib/auth-client";
import type { Equipment, EquipmentListResponse } from "@/lib/types/equipment";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Client-side authentication headers
async function getAuthHeaders() {
  const tokenResult = await authClient.token();
  const token = tokenResult.data?.token;

  if (!token) {
    throw new Error("Please sign in to continue.");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// Get Equipment Details (Server-side JWT is passed from page.tsx)
export async function getEquipmentById(
  id: string,
  token: string
): Promise<Equipment | null> {
  if (!token) {
    throw new Error("Authentication token is required.");
  }

  const response = await fetch(
    `${API_URL}/api/equipment/${encodeURIComponent(id)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Equipment not found.");
  }

  return result.equipment || result.data || null;
}

// Add Favorite (Client-side)
export async function addFavorite(equipmentId: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/api/customer/favorites`, {
    method: "POST",
    headers,
    body: JSON.stringify({ equipmentId }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Could not add favorite.");
  }

  return result;
}

// Remove Favorite (Client-side)
export async function removeFavorite(favoriteId: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/api/customer/favorites/${encodeURIComponent(favoriteId)}`,
    {
      method: "DELETE",
      headers,
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Could not remove favorite.");
  }

  return result;
}

export interface EquipmentQuery {
  search?: string;
  category?: string;
  rentalType?: string;
  minPrice?: string;
  maxPrice?: string;
  availability?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function getAllEquipment(
  query: EquipmentQuery = {},
  signal?: AbortSignal
): Promise<EquipmentListResponse> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });
  const response = await fetch(
    `${API_URL}/api/equipment?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
      signal,
    }
  );

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to load equipment");
  }
  return data;
}
