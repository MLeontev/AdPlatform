import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FullPageLoader } from '@/components/LoadingSpinner.tsx';
import { AdPublication } from '@/components/AdPublication.tsx';
import { getAd } from '@/api/ads.ts';
import { Label } from '@radix-ui/react-label';
import { AdDto } from '@/types/DTOs/adDto.ts';

export function AdPage() {
  const [searchQuery] = useSearchParams();
  const [id, setId] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<AdDto | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const adId = searchQuery.get('id');
    setId(adId ? parseInt(adId) : undefined);
    setIsLoading(false);
  }, [searchQuery]);

  useEffect(() => {
    if (id) GetAd(id).then();
  }, [id]);

  const GetAd = async (id: number) => {
    setIsLoading(true);
    const response = await getAd(id);
    setFormData(response);
    setIsLoading(false);
  };

  return (
    <div>
      {!isLoading ? (
        formData !== null ? (
          <AdPublication data={formData} />
        ) : (
          <Label>Не найдено</Label>
        )
      ) : (
        <FullPageLoader />
      )}
    </div>
  );
}
