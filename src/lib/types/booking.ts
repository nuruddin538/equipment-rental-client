export interface OwnerRental {
  _id: string;

  // Customer information
  customerId: string;
  customerName: string;
  customerEmail: string;
  contactNumber: string;
  deliveryAddress: string;

  // Equipment information
  equipmentId: string;
  equipmentName: string;
  equipmentImage: string;

  // Owner information
  ownerId: string;
  ownerName: string;
  ownerEmail: string;

  // Rental information
  startDate: string;
  endDate: string;
  rentalDays: number;
  rentalUnits: number;
  rentalType: "daily" | "weekly" | "monthly";

  quantity: number;

  // Payment information
  unitPrice: number;
  totalAmount: number;
  currency: string;

  paymentStatus: "pending" | "paid" | "failed" | "expired";
  stripeSessionId: string | null;
  stripePaymentIntentId?: string | null;
  paidAt?: string | null;

  // Booking status
  status: "pending" | "confirmed" | "cancelled" | "rejected";

  additionalNotes?: string;

  createdAt: string;
  updatedAt?: string;
}
