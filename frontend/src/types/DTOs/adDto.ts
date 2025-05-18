import { UserDto } from '@/types/DTOs/userDto.ts';
import { ImageDto } from '@/types/DTOs/imageDto.ts';
import { CategoryDto } from '@/types/DTOs/categoryDto.ts';
import { CityDto } from '@/types/DTOs/cityDto.ts';

export interface AdDto {
  id: number;
  title: string;
  description: string;
  price: number;
  isSold: boolean;
  createdAt: string;
  updatedAt?: string;
  category: CategoryDto;
  city: CityDto;
  user: UserDto;
  images: ImageDto[];
}
