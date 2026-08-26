export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}

export interface PagedRequest {
  pageIndex: number;
  pageSize: number;
  searchText?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success: boolean;
}

export interface SelectBoxDto {
  id: string;
  name: string;
  code?: string;
}

export interface ImportResult {
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: string[];
}

export interface BaseDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;
  version?: number;
}
