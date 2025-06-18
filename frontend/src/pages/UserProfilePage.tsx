import { getUser } from '@/api/user.ts';
import { FullPageLoader } from '@/components/LoadingSpinner.tsx';
import { Label } from '@/components/ui/label.tsx';
import { UserProfile } from '@/components/UserProfile.tsx';
import { UserDto } from '@/types/DTOs/userDto.ts';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function UserProfilePage() {
  const [searchQuery] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserDto | null>(null);
  const [id, setId] = useState<number | undefined>();

  useEffect(() => {
    setIsLoading(true);
    const userId = searchQuery.get('id');
    setId(userId ? parseInt(userId) : undefined);
    setIsLoading(false);
  }, [searchQuery]);

  useEffect(() => {
    setIsLoading(true);
    if (id) getUser(id).then((response) => setUser(response));
    setIsLoading(false);
  }, [id]);

  return !isLoading ? (
    user ? (
      <UserProfile user={user} />
    ) : (
      <Label>Пользователь не найден</Label>
    )
  ) : (
    <FullPageLoader />
  );
}
