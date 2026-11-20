export interface Owner {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  role: "owner";
}

export interface OwnerProfileUpdate {
  name: string;
  phone: string;
  image?: string;
}
