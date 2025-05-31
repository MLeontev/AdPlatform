import { UserLinkDto } from '@/types/DTOs/userLinkDto.ts';

export interface UserDto {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  avatarSrc: string;
  registrationDate: string;
  links: UserLinkDto[];
}
