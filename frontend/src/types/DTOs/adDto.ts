import { UserDto } from '@/types/DTOs/userDto.ts';
import { ImageDto } from '@/types/DTOs/imageDto.ts';

export interface AdDto {
  id: number;
  title: string;
  description: string;
  price: number;
  isSold: boolean;
  createdAt: string;
  updatedAt?: string;
  categoryId: string;
  categoryName: string;
  cityId: string;
  cityName: string;
  user: UserDto;
  images: ImageDto[];
}
