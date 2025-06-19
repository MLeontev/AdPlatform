import {UserLinkDto} from "@/types/DTOs/userLinkDto.ts";

export interface UpdateProfileDto {
  name: string;
  surname: string;
  email: string;
  phone: string;
  avatar: File | undefined;
  links: UserLinkDto[];
}
