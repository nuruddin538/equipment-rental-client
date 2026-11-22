import { authClient } from "@/lib/auth-client";
import type {
  AdminAnalytics,
  OwnerAnalytics,
  AnalyticsResponse,
} from "@/lib/types/analytics";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function analyticsRequest<T>(
  endpoint: string
): Promise<AnalyticsResponse<T>> {
  const tokenResult = await authClient.token();
  const token = tokenResult.data?.token;

  if (!token) {
    throw new Error("Authentication required. Please sign in again.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    const responseText = await response.text();

    console.error("Expected JSON but received:", {
      url: `${API_BASE_URL}${endpoint}`,
      status: response.status,
      contentType,
      response: responseText.slice(0, 500),
    });

    throw new Error(
      `Server returned HTML or an invalid response. Status: ${response.status}. Check your API URL and backend route.`
    );
  }

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load analytics.");
  }

  return result as AnalyticsResponse<T>;
}

export function getAdminAnalytics() {
  return analyticsRequest<AdminAnalytics>("/api/admin/analytics");
}

export function getOwnerAnalytics() {
  return analyticsRequest<OwnerAnalytics>("/api/owner/analytics");
}
