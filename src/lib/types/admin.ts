export type UserRole = "customer" | "owner" | "admin";

export type EquipmentStatus = "pending" | "approved" | "rejected";

export type RentalStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled"
  | "rejected";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  createdAt: string;
}

export interface AdminEquipment {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rentalType: "daily" | "weekly" | "monthly";
  availableQuantity: number;
  condition: string;
  brand?: string;
  model?: string;
  imageUrl?: string;
  status: EquipmentStatus;
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  createdAt: string;
}

export interface AdminRental {
  _id: string;

  customerName?: string;
  customerEmail?: string;

  ownerName?: string;
  ownerEmail?: string;

  equipmentName?: string;
  equipmentImage?: string;

  startDate?: string;
  endDate?: string;

  quantity?: number;
  totalAmount?: number;
  currency?: string;

  paymentStatus?: string;
  status: RentalStatus;

  createdAt: string;
}

export interface AdminProfile {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  phone?: string;
  createdAt?: string;
}

export interface EquipmentUpdateData {
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rentalType: "daily" | "weekly" | "monthly";
  availableQuantity: number;
  condition: string;
  brand?: string;
  model?: string;
  imageUrl?: string;
  rentalTerms?: string;
}
