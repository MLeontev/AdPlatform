import { PagedListDto } from '@/types/DTOs/pagedListDto.ts';
import { toast } from 'sonner';
import api from './axios';

export const addToFavourites = async (adId: number): Promise<boolean> => {
  try {
    await api.post(`/api/favourites/${adId}`);
    toast('✅ Добавлено в избранное');
    return true;
  } catch (error) {
    console.error('Ошибка при добавлении в избранное:', error);
    toast('❌ Не удалось добавить в избранное');
    return false;
  }
};

export const removeFromFavourites = async (adId: number): Promise<boolean> => {
  try {
    await api.delete(`/api/favourites/${adId}`);
    toast('✅ Удалено из избранного');
    return true;
  } catch (error) {
    console.error('Ошибка при удалении из избранного:', error);
    toast('❌ Не удалось удалить из избранного');
    return false;
  }
};

export const getFavouriteAds = async (
  params: URLSearchParams,
): Promise<PagedListDto | null> => {
  try {
    const response = await api.get<PagedListDto>('/api/favourites/ads', {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении избранных объявлений:', error);
    toast('❌ Не удалось получить избранные объявления');
    return null;
  }
};
