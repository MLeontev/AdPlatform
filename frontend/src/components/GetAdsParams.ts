import { GetAdsDto } from '@/types/DTOs/getAdsDto.ts';

export function GetAdsParams(searchParams: URLSearchParams): GetAdsDto {
  const getNumber = (key: string): number | null => {
    const value = searchParams.get(key);
    return value ? parseInt(value, 10) : null;
  };

  const getNumberArray = (key: string): number[] => {
    return searchParams
      .getAll(key)
      .map(Number)
      .filter((n) => !isNaN(n));
  };

  return {
    categoryId: getNumber('categoryId'),
    cityIds: getNumberArray('cityIds'),
    searchQuery: searchParams.get('searchQuery') || undefined,
    minPrice: getNumber('minPrice'),
    maxPrice: getNumber('maxPrice'),
    pageNumber: getNumber('pageNumber') || 1,
    pageSize: getNumber('pageSize') || 5,
  };
}
