export type PaginatedResource<T> = {
  totalItems: number;
  items: T[];
  page: number;
  size: number;
};

export interface Pagination {
  page: number;
  limit: number;
  size: number;
  offset: number;
}
