import AdFeed from '@/components/AdFeed.tsx';
import { useAuthStore } from '@/store/authStore.ts';
import { Label } from '@/components/ui/label.tsx';

export function FavouritesPage() {
  const userId = useAuthStore((store) => store.id);

  return (
    <div className="flex flex-col h-full items-center">
      <Label className="mb-6 text-3xl">⭐Избранные объявления</Label>
      <AdFeed isFullScreenOpened={true} userId={userId ? userId : undefined} isFavouritesOpened={true} />
    </div>
  );
}
