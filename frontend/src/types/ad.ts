export interface Ad {
  id?: number;
  title: string;
  description: string;
  price: number;
  category: string;
  city: string;
  user: string;
  images: string[];
  isSold: boolean;
  createdAt?: string;
  updatedAt?: string;
}
