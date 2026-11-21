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

  paymentStatus: string;
  status: CustomerBookingStatus;
}

export interface FavoriteEquipment {
  _id: string;
  favoriteId: string;
  createdAt: string;

  equipment: {
    _id: string;
    name: string;
    description?: string;
    category: string;
    location: string;
    price: number;
    rentalType: "daily" | "weekly" | "monthly";
    imageUrl?: string;
    status: "pending" | "approved" | "rejected";
  };
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
