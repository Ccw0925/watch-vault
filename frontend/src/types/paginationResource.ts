export interface PaginationResource<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  pageSize: number;
  page: number;
  next?: string;
  prev?: string;
}
