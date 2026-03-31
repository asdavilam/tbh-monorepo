// Shared types across the monorepo

export type UUID = string;

export type Timestamp = string;

export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
