import { useEffect, useState } from 'react';
import { AdListItemDto } from '@/types/DTOs/adListItemDto.ts';
import { AdFeedElement } from '@/components/AdFeedElement.tsx';
import { getAds } from '@/api/ads.ts';
import { PagedListDto } from '@/types/DTOs/pagedListDto.ts';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { MultiCitySelector } from '@/components/MultiCitySelector.tsx';
import { SingleCategorySelector } from '@/components/SingleCategorySelector.tsx';
import { Label } from '@radix-ui/react-label';
import { PriceRangeSelector } from '@/components/PriceRangeeSelector.tsx';
import { useSearchParams } from 'react-router-dom';
import qs from 'qs';
import { GetAdsParams } from '@/components/GetAdsParams.ts';
import { DataPagination } from '@/components/DataPagination.tsx';
import { PageSizeSelector } from '@/components/PageSizeSelector.tsx';
import { LoadingSpinner } from '@/components/LoadingSpinner.tsx';

function AdFeed() {
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

  const requestAds = async (params: URLSearchParams) => {
    setIsLoading(true);
    const response = await getAds(params);
    if (response) setCurrentPage(response);
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
    };
    updateQueryParams(qs.stringify(queryParams));
  };

  const onSearch = () => {
    fetchAds().then();
  };

  const onClick = (adId: number) => {
    console.log(adId);
  };

  return (
    <div className="min-w-[900px]">
      <div className="flex justify-center h-screen mr-[250px]">
        <div className="flex flex-col relative right-4 w-[250px]">
          <SingleCategorySelector
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            className="rounded-xl border-1 border-gray-300 shadow-md w-full max-w-xs p-4 space-y-4 mb-3"
          />
          <MultiCitySelector
            selectedCities={selectedCities}
            onCitiesChange={setSelectedCities}
            className="rounded-xl border-1 border-gray-300 shadow-md w-full max-w-xs p-4 space-y-4 mb-3 min-h-[300px]"
          />
          <PriceRangeSelector
            value={priceRange}
            onValueChange={setPriceRange}
            className="rounded-xl border-1 border-gray-300 p-4 shadow-md mb-3"
          />
          <Button className="m-1 rounded-2xl" onClick={onSearch}>
            Подтвердить
          </Button>
        </div>
        <div className="flex flex-col w-[768px]">
          <div className="searchQuery flex flex-row">
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
          {!isLoading ? (
            currentPage?.totalCount !== undefined &&
            currentPage?.totalCount > 0 ? (
              currentPage?.items.map((ad: AdListItemDto) => (
                <AdFeedElement key={ad.id} ad={ad} onClick={onClick} />
              ))
            ) : (
              <Label className="m-2">Объявления не найдены</Label>
            )
          ) : (
            <LoadingSpinner text="Пожалуйста, подождите..." className="my-3" />
          )}
          <div className="flex mt-auto">
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
