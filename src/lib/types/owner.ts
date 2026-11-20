export type RentalType = "daily" | "weekly" | "monthly";

export type EquipmentCondition = "New" | "Like New" | "Good" | "Fair";

export type EquipmentStatus = "pending" | "approved" | "rejected";

export interface Equipment {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;

  price: number;
  pricePerDay?: number;
  rentalType: RentalType;
  availableQuantity: number;

  condition: EquipmentCondition;
  brand: string;
  model: string;

  imageUrl: string;
  images?: string[];
  rentalTerms: string;

  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerImage?: string;

  status: EquipmentStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface EquipmentFormData {
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rentalType: RentalType;
  availableQuantity: number;
  condition: EquipmentCondition;
  brand: string;
  model: string;
  imageUrl: string;
  rentalTerms: string;
}

export interface OwnerProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  role: "owner";
}

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
  rentalType: RentalType;

  quantity: number;
  totalAmount: number;
  currency: string;

  paymentStatus: string;
  status: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  equipment?: T;
  [key: string]: unknown;
}
