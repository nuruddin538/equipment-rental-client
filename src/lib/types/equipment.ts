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
  displayPrice?: number;
  isAvailable?: boolean;
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

export interface BookingFormData {
  equipmentId: string;
  startDate: string;
  endDate: string;
  quantity: number;
  contactNumber: string;
  deliveryAddress: string;
  additionalNotes?: string;
}

export interface CheckoutResponse {
  success: boolean;
  checkoutUrl?: string;
  bookingId?: string;
  totalAmount?: number;
  currency?: string;
  message?: string;
}

export interface EquipmentListResponse {
  success: boolean;
  message: string;
  equipments: Equipment[];
  categories: string[];
  pagination: {
    currentPage: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
