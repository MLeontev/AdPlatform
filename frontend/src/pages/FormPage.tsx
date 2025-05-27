import { AdFormInitialized } from '@/components/AdFormInitialized.tsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FullPageLoader } from '@/components/LoadingSpinner.tsx';

export function FormPage() {
  const [searchQuery] = useSearchParams();
  const [id, setId] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const adId = searchQuery.get('id');
    console.log(adId);
    setId(adId ? parseInt(adId) : undefined);
    setIsLoading(false);
  }, [searchQuery]);

  return (
    <div>
      {!isLoading ? (
        <AdFormInitialized
          id={id}
          onSubmit={async () => {
            setIsLoading(true);
            await new Promise((r) => setTimeout(r, 1000));
            navigate(0);
          }}
        />
      ) : (
        <FullPageLoader />
      )}
    </div>
  );
}
