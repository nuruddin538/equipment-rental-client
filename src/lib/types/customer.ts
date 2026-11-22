import { Equipment } from "./equipment";

export type CustomerBookingStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled"
  | "rejected";

export interface CustomerRental {
  _id: string;

  equipmentId?: string;
  equipmentName: string;
  equipmentImage?: string;

  startDate: string;
  endDate: string;
  createdAt: string;

  totalAmount: number;
  currency?: string;

  paymentStatus: "pending" | "paid" | "failed" | "expired";
  status: CustomerBookingStatus;
}

// Favorite Equipment
export interface FavoriteEquipment {
  favoriteId: string;
  equipmentId: string;
  createdAt: string;

  equipment: Equipment;
}

export interface CustomerProfile {
  _id?: string;
  id?: string;

  name: string;
  email: string;
  role: "customer" | "owner" | "admin";

  image?: string;
  phone?: string;
  address?: string;

  createdAt?: string;
}

export interface ProfileUpdateData {
  name: string;
  phone: string;
  address: string;
  image: string;
}
