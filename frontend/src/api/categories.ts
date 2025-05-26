import axios from 'axios';
import { Category } from '@/types/category.ts';

export const getCategories = async (): Promise<Category[] | null> => {
  return await axios
    .get<Category[]>('/api/Category')
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Ошибка при получении:', error);
      return null;
    });
};
