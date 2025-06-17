import { getAd, postAd, putAd } from '@/api/ads.ts';
import { AdForm } from '@/components/AdForm';
import { FullPageLoader } from '@/components/LoadingSpinner.tsx';
import { Ad } from '@/types/ad';
import { useEffect, useState } from 'react';

interface AdFormInitializedProps {
  id?: number;
  onSubmit?: (adId: number) => void;
}

export function AdFormInitialized({ id, onSubmit }: AdFormInitializedProps) {
  const [formData, setFormData] = useState<Ad | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id) GetAd(id).then();
  }, []);

  const GetAd = async (id: number) => {
    setIsLoading(true);
    const response = await getAd(id);
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
        imagesToRemove: [],
      };
      setFormData(data);
    }
    setIsLoading(false);
  };

  const PostAd = async (formData: Ad) => {
    const newAdId = await postAd(formData);
    if (newAdId !== -1 && onSubmit) {
      onSubmit(newAdId);
    }
  };

  const PutAd = async (formData: Ad, id?: number) => {
    if (id) {
      await putAd(id, { ...formData });
      onSubmit?.(id);
    }
  };

  return (
    <>
      {!isLoading ? (
        id ? (
          <AdForm initialData={formData} onSubmit={PutAd} />
        ) : (
          <AdForm onSubmit={PostAd} />
        )
      ) : (
        <FullPageLoader />
      )}
    </>
  );
}
