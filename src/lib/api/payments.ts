import { authClient } from "@/lib/auth-client";
import type { BookingFormData, CheckoutResponse } from "@/lib/types/equipment";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Get Better Auth access token
async function getToken(): Promise<string> {
  const tokenResult = await authClient.token();
  const token = tokenResult.data?.token;

  if (!token) {
    throw new Error("Please sign in first.");
  }

  return token;
}

// Create Stripe Checkout Session

export async function createCheckout(
  bookingData: BookingFormData
): Promise<CheckoutResponse> {
  const token = await getToken();

  console.log("Checkout request payload:", bookingData);

  const response = await fetch(`${API_URL}/api/bookings/checkout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  const result = await response.json();

  console.log("Checkout API response:", {
    status: response.status,
    result,
  });

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || `Checkout failed with status ${response.status}`
    );
  }

  return result as CheckoutResponse;
}

// Verify Stripe Checkout Payment
export async function verifyCheckout(sessionId: string) {
  if (!sessionId) {
    throw new Error("Stripe session ID is required.");
  }

  const token = await getToken();

  const response = await fetch(`${API_URL}/api/payments/checkout-verify`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Payment verification failed.");
  }

  return result;
}
