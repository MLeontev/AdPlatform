import { City } from '@/types/city.ts';
import api from './axios';

export const getCities = async (): Promise<City[] | null> => {
  return await api
    .get<City[]>('/api/City')
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error('Ошибка при получении:', error);
      return null;
    });
};
