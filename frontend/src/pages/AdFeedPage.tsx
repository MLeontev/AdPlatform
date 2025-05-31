import AdFeed from '@/components/AdFeed.tsx';
import { Label } from '@/components/ui/label.tsx';

export function AdFeedPage() {
  return (
    <div className="flex flex-col h-full items-center h-full">
      <Label className="text-4xl mb-10">⭐Избранное</Label>
      <AdFeed isFullScreenOpened={true} />
    </div>
  );
}
