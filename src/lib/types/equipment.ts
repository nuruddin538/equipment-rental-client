export type RentalType = "daily" | "weekly" | "monthly";

export type EquipmentCondition = "New" | "Like New" | "Good" | "Fair";

export type EquipmentStatus = "pending" | "approved" | "rejected";

export interface Equipment {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  title?: string;

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
