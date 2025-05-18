import { AdForm } from '@/components/AdForm';
import { Ad } from '@/types/ad';
import { getAd, postAd, putAd } from '@/api/ads.ts';
import { useEffect, useState } from 'react';

function FormPage() {
  const [formData, setFormData] = useState<Ad | null>(null);

  useEffect(() => {
    GetAd(29); // Тестирование работы запроса
  }, []);

  const PostAd = async (formData: Ad) => {
    const response = await postAd({ ...formData });
    console.log(response);
  };

  const GetAd = async (id: number) => {
    const response = await getAd(id);
    console.log(response);
    if (response) {
      const data: Ad = {
        id: response.id,
        title: response.title,
        description: response.description,
        price: response.price,
        categoryId: response.categoryId.toString(),
        cityId: response.cityId.toString(),
        user: response.user.id.toString(),
        imagesUploaded: response.images,
        isSold: response.isSold,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        imagesLocal: [],
      };
      setFormData(data);
    }
  };

  const PutAd = async (formData: Ad, id?: number) => {
    if (id) {
      const response = await putAd(id, { ...formData });
      console.log(response);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 w-fit mx-auto p-6">
        <AdForm
          onSubmit={PostAd}
          categories={[{ id: 1, name: 'Электроника' }]}
          cities={[{ id: 1, name: 'Респ Адыгея, г Адыгейск' }]}
        />
        {formData && (
          <AdForm
            initialData={formData}
            onSubmit={PutAd}
            categories={[{ id: 1, name: 'Электроника' }]}
            cities={[{ id: 1, name: 'Респ Адыгея, г Адыгейск' }]}
          />
        )}
      </div>
    </>
  );
}

export default FormPage;
