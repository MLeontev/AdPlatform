import { useEffect, useState } from 'react';
import { AdListItemDto } from '@/types/DTOs/adListItemDto.ts';
import { AdFeedElement } from '@/components/AdFeedElement.tsx';
import { getAds, getUserAds, getUserFavouriteAds } from '@/api/ads.ts';
import { PagedListDto } from '@/types/DTOs/pagedListDto.ts';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { MultiCitySelector } from '@/components/MultiCitySelector.tsx';
import { SingleCategorySelector } from '@/components/SingleCategorySelector.tsx';
import { Label } from '@radix-ui/react-label';
import { PriceRangeSelector } from '@/components/PriceRangeeSelector.tsx';
import { Link, useSearchParams } from 'react-router-dom';
import qs from 'qs';
import { GetAdsParams } from '@/components/GetAdsParams.ts';
import { DataPagination } from '@/components/DataPagination.tsx';
import { PageSizeSelector } from '@/components/PageSizeSelector.tsx';
import { LoadingSpinner } from '@/components/LoadingSpinner.tsx';
import { Card } from '@/components/ui/card.tsx';
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

function AdFeed(
  componentParams: {
    userId?: number;
    isFullScreenOpened?: boolean;
    isFavouritesOpened?: boolean;
    adsCount?: (number: number) => void;
  } = { isFullScreenOpened: true, isFavouritesOpened: false },
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<PagedListDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCities, setSelectedCities] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<{
    min: number | null;
    max: number | null;
  }>({ min: null, max: null });
  const [sidebarOpen, setSidebarOpen] = useState(
    componentParams.isFullScreenOpened,
  );

  useEffect(() => {
    const params = GetAdsParams(searchParams);

    if (params.categoryId) setSelectedCategory(params.categoryId);
    if (params.cityIds?.length) setSelectedCities(params.cityIds);
    if (params.searchQuery) setSearchQuery(params.searchQuery);
    setPriceRange({
      min: params.minPrice !== undefined ? params.minPrice : null,
      max: params.maxPrice !== undefined ? params.maxPrice : null,
    });

    requestAds(searchParams).then();
  }, [searchParams]);

  useEffect(() => {
    if (componentParams.adsCount && currentPage)
      componentParams.adsCount(currentPage.totalCount);
  }, [currentPage]);

  useEffect(() => {
    setSidebarOpen(componentParams.isFullScreenOpened);
  }, [componentParams.isFullScreenOpened]);

  const requestAds = async (params: URLSearchParams) => {
    setIsLoading(true);
    if (componentParams.isFavouritesOpened) {
      setCurrentPage(await getUserFavouriteAds(params));
    } else if (componentParams.userId) {
      setCurrentPage(await getUserAds(params, componentParams.userId));
    } else {
      setCurrentPage(await getAds(params));
    }
    setIsLoading(false);
  };

  const updateQueryParams = (params: string) => {
    setSearchParams(params);
  };

  const fetchAds = async () => {
    const queryParams = {
      pageNumber: currentPage?.page,
      pageSize: currentPage?.pageSize,
      searchQuery: searchQuery,
      cityIds: selectedCities,
      categoryId: selectedCategory,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      userId: componentParams.userId,
    };
    updateQueryParams(qs.stringify(queryParams));
  };

  const onSearch = () => {
    fetchAds().then();
  };

  const onClick = (adId: number) => {
    console.log(adId);
  };

  const renderFilters = () => (
    <ScrollArea className="h-full pr-3">
      <div className="flex flex-col space-y-4">
        <Card className="p-3 space-y-4">
          <SingleCategorySelector
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            className="w-full min-h-[200px]"
          />
        </Card>
        <Card className="p-3 space-y-4">
          <MultiCitySelector
            selectedCities={selectedCities}
            onCitiesChange={setSelectedCities}
            className="w-full min-h-[300px]"
          />
        </Card>
        <Card className="p-3 space-y-4">
          <PriceRangeSelector
            value={priceRange}
            onValueChange={setPriceRange}
          />
        </Card>
        <Button className="rounded-2xl" onClick={onSearch}>
          Подтвердить
        </Button>
      </div>
    </ScrollArea>
  );

  return (
    <div className="flex h-full w-full">
      {sidebarOpen && (
        <div className="w-[250px] flex-shrink-0">{renderFilters()}</div>
      )}

      <div className={`flex-1 ${!sidebarOpen ? 'pl-0' : 'pl-4'}`}>
        <div className="flex flex-col h-full">
          <div className="flex flex-row w-full">
            <Button
              variant="ghost"
              size="sm"
              className="w-9 p-0 left-0 top-24"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeftOpen className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle sidebar</span>
            </Button>

            <div className="searchQuery flex flex-row mb-4 w-full">
              <Input
                type={'text'}
                value={searchQuery}
                className="rounded-2xl"
                placeholder={'Поиск'}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="ml-1 rounded-2xl" onClick={onSearch}>
                Поиск
              </Button>
            </div>
          </div>

          {!isLoading ? (
            currentPage?.totalCount !== undefined &&
            currentPage?.totalCount > 0 ? (
              <div className="space-y-4 flex-1">
                {currentPage?.items.map((ad: AdListItemDto) => (
                  <Link key={ad.id} to={`/ad?id=${ad.id}`}>
                    <AdFeedElement ad={ad} onClick={onClick} />
                  </Link>
                ))}
              </div>
            ) : (
              <Label className="m-2">Объявления не найдены</Label>
            )
          ) : (
            <LoadingSpinner text="Пожалуйста, подождите..." className="my-3" />
          )}

          <div className="flex mt-auto pt-4">
            {currentPage !== null && (
              <PageSizeSelector pageSize={currentPage.pageSize} />
            )}
            {currentPage !== null && (
              <DataPagination
                currentPage={currentPage.page}
                totalPages={currentPage.totalPages}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdFeed;
