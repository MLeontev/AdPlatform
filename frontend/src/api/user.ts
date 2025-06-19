import axios from 'axios';
import { toast } from 'sonner';
import { UserDto } from '@/types/DTOs/userDto.ts';
import { UpdateProfileDto } from '@/types/DTOs/updateProfileDto.ts';
import api from './axios';

export const getUser = async (id: number): Promise<UserDto | null> => {
  try {
    const response = await axios.get<UserDto>('/api/user/' + id);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении:', error);
    toast('❌ Не удалось получить поьзователя');
    return null;
  }
};

export const updateUser = async (id: number, formData: UpdateProfileDto): Promise<void> => {
  try {
    const formDataToSend = new FormData();

    formDataToSend.append('Name', formData.name);
    formDataToSend.append('Surname', formData.surname);
    formDataToSend.append('Email', formData.email);
    formDataToSend.append('Phone', formData.phone);
    if (formData.avatar) {
      formDataToSend.append('Avatar', formData.avatar);
    }
    formData.links.forEach((link, index) => {
      formDataToSend.append(`links[${index}].Platform`, link.platform);
      formDataToSend.append(`links[${index}].Link`, link.link);
    });

    await api.put<UserDto>('/api/user/' + id, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast('✅ Объявление обновлено');
  } catch (error) {
    console.error('Ошибка при обновлении:', error);
    toast('❌ Не удалось обновить профиль пользователя');
  }
};
