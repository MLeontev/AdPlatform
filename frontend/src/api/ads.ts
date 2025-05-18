import axios from 'axios';
import { Ad } from '@/types/ad.ts';
import { AdDto } from '@/types/DTOs/adDto.ts';

export const postAd = async (formData: Ad): Promise<number> => {
  try {
    const formDataToSend = new FormData();

    formDataToSend.append('Title', formData.title);
    formDataToSend.append('Description', formData.description);
    formDataToSend.append('Price', formData.price.toString());
    formDataToSend.append('CategoryId', formData.categoryId);
    formDataToSend.append('CityId', formData.cityId);

    for (let i = 0; i < formData.imagesLocal.length; i++) {
      formDataToSend.append('Files', formData.imagesLocal[i]);
    }

    console.log(formDataToSend);
    const response = await axios.post('/api/ad', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Успешно отправлено:', response.data);
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке:', error);
    return -1;
  }
};

export const getAd = async (id: number): Promise<AdDto | null> => {
  try {
    const response = await axios.get<AdDto>('/api/ad/' + id);
    console.log('Успешно получено.');
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении:', error);
    return null;
  }
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

    console.log(formDataToSend);
    const response = await axios.put<AdDto>('/api/ad/' + id, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Успешно получено:', response.data);
  } catch (error) {
    console.error('Ошибка при получении:', error);
  }
};
