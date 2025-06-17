import axios from 'axios';
import { toast } from 'sonner';
import { UserDto } from '@/types/DTOs/userDto.ts';

export const getUser = async (id: number): Promise<UserDto | null> => {
  try {
    const response = await axios.get<UserDto>('/api/user/' + id);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении:', error);
    toast('❌ Не удалось получить объявление');
    return null;
  }
};
