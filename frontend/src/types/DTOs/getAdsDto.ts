export interface GetAdsDto {
  categoryId?: number | null;
  cityIds?: number[];
  searchQuery?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  pageNumber: number;
  pageSize: number;
  isSold?: boolean | null;
}
