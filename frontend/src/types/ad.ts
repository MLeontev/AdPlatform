import { AdImage } from '@/types/adImage.ts';

export interface Ad {
  id?: number;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  cityId: string;
  user: string;
  imagesLocal: File[];
  imagesUploaded: AdImage[];
  imagesToRemove: AdImage[];
  isSold: boolean;
  createdAt?: string;
  updatedAt?: string;
}
