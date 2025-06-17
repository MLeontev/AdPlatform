import AdFeed from '@/components/AdFeed.tsx';

export function AdFeedPage() {
  return (
    <div className="flex flex-col h-full items-center">
      <AdFeed isFullScreenOpened={true} />
    </div>
  );
}
