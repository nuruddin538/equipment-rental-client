export type Equipment = {
  _id: string;
  name: string;
  title?: string;
  category: string;
  imageUrl?: string;
  images?: string[];
  location: string;
  pricePerDay?: number;
  price?: number;
  rentalType?: string;
  availability?: string;
  description?: string;
};
