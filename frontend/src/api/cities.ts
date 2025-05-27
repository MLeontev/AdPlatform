import axios from 'axios';
import { City } from '@/types/city.ts';

export const getCities = async (): Promise<City[] | null> => {
  return await axios
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
