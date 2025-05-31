import { UserProfile } from '@/components/UserProfile.tsx';
import { UserDto } from '@/types/DTOs/userDto.ts';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FullPageLoader } from '@/components/LoadingSpinner.tsx';
import { getUser } from '@/api/user.ts';
import { Label } from '@/components/ui/label.tsx';

export default function UserProfilePage() {
  const [searchQuery] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserDto | null>(null);
  const [id, setId] = useState<number | undefined>();

  useEffect(() => {
    setIsLoading(true);
    const userId = searchQuery.get('userId');
    setId(userId ? parseInt(userId) : undefined);
    setIsLoading(false);
  }, [searchQuery]);

  useEffect(() => {
    setIsLoading(true);
    if (id) getUser(id).then((response) => setUser(response));
    setIsLoading(false);
  }, [id]);

  const handleCreateAd = () => {
    console.log('Navigate to create ad page');
  };

  return !isLoading ? (
    user ? (
      <UserProfile user={user} onCreateAd={handleCreateAd} />
    ) : (
      <Label>Пользователь не найден</Label>
    )
  ) : (
    <FullPageLoader />
  );
}
