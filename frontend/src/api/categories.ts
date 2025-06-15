import { Category } from '@/types/category.ts';
import api from './axios';

export const getCategories = async (): Promise<Category[] | null> => {
  return await api
    .get<Category[]>('/api/Category')
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Ошибка при получении:', error);
      return null;
    });
};
