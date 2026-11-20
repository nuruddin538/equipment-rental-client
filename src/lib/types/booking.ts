export interface OwnerRental {
  _id: string;

  customerId: string;
  customerName: string;
  customerEmail: string;
  contactNumber: string;
  deliveryAddress: string;

  equipmentId: string;
  equipmentName: string;
  equipmentImage: string;

  startDate: string;
  endDate: string;
  rentalDays: number;
  rentalType: "daily" | "weekly" | "monthly";

  quantity: number;

  totalAmount: number;
  currency: string;

  paymentStatus: "unpaid" | "paid" | "failed" | "expired";
  status: "pending" | "confirmed" | "cancelled";

  createdAt: string;
}
