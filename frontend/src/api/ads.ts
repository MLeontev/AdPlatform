import axios from 'axios';
import { Ad } from '@/types/ad.ts';
import { AdDto } from '@/types/DTOs/adDto.ts';
import { PagedListDto } from '@/types/DTOs/pagedListDto.ts';
import { toast } from 'sonner';

export const postAd = async (formData: Ad): Promise<number> => {
  const formDataToSend = new FormData();

  formDataToSend.append('Title', formData.title);
  formDataToSend.append('Description', formData.description);
  formDataToSend.append('Price', formData.price.toString());
  formDataToSend.append('CategoryId', formData.categoryId);
  formDataToSend.append('CityId', formData.cityId);

  for (let i = 0; i < formData.imagesLocal.length; i++) {
    formDataToSend.append('Files', formData.imagesLocal[i]);
  }

  return await axios
    .post('/api/ad', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      toast('✅ Объявление создано');
      return response.data;
    })
    .catch((error) => {
      console.error('Ошибка при отправке:', error);
      toast('❌ Не удалось создать объявление');
      return -1;
    });
};

export const getAd = async (id: number): Promise<AdDto | null> => {
  try {
    const response = await axios.get<AdDto>('/api/ad/' + id);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении:', error);
    toast('❌ Не удалось получить объявление');
    return null;
  }
};

export const getAds = async (
  params: URLSearchParams,
): Promise<PagedListDto | null> => {
  return await axios
    .get<PagedListDto>('/api/ad', {
      params: params,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Ошибка при получении:', error);
      toast('❌ Не удалось получить объявления');
      return null;
    });
};

export const getUserAds = async (
  params: URLSearchParams,
  userId: number,
): Promise<PagedListDto | null> => {
  return await axios
    .get<PagedListDto>('/api/ad/user' + userId, {
      params: params,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Ошибка при получении:', error);
      toast('❌ Не удалось получить объявления');
      return null;
    });
};

export const putAd = async (id: number, formData: Ad): Promise<void> => {
  try {
    const formDataToSend = new FormData();

    formDataToSend.append('Title', formData.title);
    formDataToSend.append('Description', formData.description);
    formDataToSend.append('Price', formData.price.toString());
    formDataToSend.append('CategoryId', formData.categoryId);
    formDataToSend.append('CityId', formData.cityId);
    formDataToSend.append('IsSold', formData.isSold.toString());

    for (let i = 0; i < formData.imagesLocal.length; i++) {
      formDataToSend.append('NewFiles', formData.imagesLocal[i]);
    }

    if (formData.imagesToRemove) {
      for (let i = 0; i < formData.imagesToRemove.length; i++) {
        formDataToSend.append(
          'RemoveFileNames',
          formData.imagesToRemove[i].fileName,
        );
      }
    }

    await axios.put<AdDto>('/api/ad/' + id, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast('✅ Объявление обновлено');
  } catch (error) {
    console.error('Ошибка при получении:', error);
    toast('❌ Не удалось обновить объявление');
  }
};
