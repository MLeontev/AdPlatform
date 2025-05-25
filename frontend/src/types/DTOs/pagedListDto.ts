import { AdListItemDto } from './adListItemDto';

export interface PagedListDto {
  items: AdListItemDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
